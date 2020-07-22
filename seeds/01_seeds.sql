INSERT INTO users (name, email, password)
VALUES ('Simon', '123@321.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Moses', '456@654.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Rachel', '789@987.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Cottage', 'description', 'google.com/images', 'google.com/images', 100, 1, 1, 1, 'Canada', 'Sesame St', 'The 6', 'Ontario', 'a1b 2c3'),
(1, 'House', 'description', 'google.com/images', 'google.com/images', 200, 2, 2, 3, 'Korea', 'BTS Rd', 'Gangnam', 'Soul', 'kkkkkk'),
(1, 'Mansion', 'description', 'google.com/images', 'google.com/images', 500, 10, 7, 11, 'Poland', 'Babushka Ave', 'Warsaw', 'Dobra', 'kopchae');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-08-04', '2020-08-18', 1, 2),
('2020-10-13', '2020-10-22', 2, 2),
('2020-12-31', '2021-01-01', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'message'),
(2, 2, 2, 5, 'message'),
(3, 3, 3, 5, 'message');