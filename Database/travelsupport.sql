CREATE DATABASE IF NOT EXISTS travelsupport;
USE travelsupport;

CREATE TABLE provinces (
  province_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE,
  longitude DOUBLE
);

CREATE TABLE users (
  user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(255),
  role VARCHAR(255),
  birth_date VARCHAR(255),
  image VARCHAR(255) NOT NULL
);

CREATE TABLE tours (
  tour_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  price INT,
  days INT,
  rating FLOAT DEFAULT 4.0,
  popularity FLOAT DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT
);

CREATE TABLE locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_cost INT,
  image VARCHAR(255),
  nice_time VARCHAR(255),
  province_id INT,
  type VARCHAR(255)
);

CREATE TABLE foods (
  food_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  estimated_price INT,
  image VARCHAR(255),
  province_id INT,
  type VARCHAR(255)
);

CREATE TABLE tour_provinces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id VARCHAR(255),
  province_id INT,
  visit_order INT
);

CREATE TABLE tour_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id VARCHAR(255),
  location_id INT
);

CREATE TABLE tour_foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tour_id VARCHAR(255),
  food_id INT
);

CREATE TABLE transport_types (
  transport_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  cost_per_km DOUBLE
);

CREATE TABLE user_interactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  location_id INT,
  event_type VARCHAR(255) NOT NULL,
  value DOUBLE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);