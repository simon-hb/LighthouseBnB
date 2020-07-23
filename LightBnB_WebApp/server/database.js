const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1
  `, [email])
  .then(res => res.rows[0])
  .catch(err => null);
  // old code
  // let user; 
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1
`, [id])
.then(res => res.rows[0])
.catch(err => null);
  // return Promise.resolve(users[id]); (old code)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
`, [user.name, user.email, user.password])
.then(res => res.rows[0])
.catch(err => null);
  //old code
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, AVG (property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2
`, [guest_id, limit])
.then(res => res.rows)
.catch(err => null);
  // return getAllProperties(null, 2); (old code)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  let whereOrAnd;
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id ) {
    whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
    queryParams.push(`${options.owner_id}`);
    queryString += `${whereOrAnd} owner_id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    const minPriceDollars = options.minimum_price_per_night * 100;
    const maxPriceDollars = options.maximum_price_per_night * 100;
    whereOrAnd = (queryParams.length === 0 ? 'WHERE' : 'AND');
    queryParams.push(`${minPriceDollars}`, `${maxPriceDollars}`);
    queryString += `${whereOrAnd} cost_per_night BETWEEN $${queryParams.length - 1}  AND $${queryParams.length} `
  }

  //3.5 GROUP BY clause comes before having
  queryString += `
  GROUP BY properties.id
  `

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5 commented out console log since working
  //console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const { owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,  street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms} = property;

  return pool.query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,  street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11, $12, $13, $14)
  RETURNING *;
`, [owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,  street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms])
.then(res => res.rows[0])
.catch(err => null);
  // old code
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
