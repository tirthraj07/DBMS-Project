CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_full_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) UNIQUE NOT NULL,
    customer_password VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_logs (
    customer_id INT NOT NULL,
    customer_full_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_action TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_genre_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_genre_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_title VARCHAR(100) NOT NULL,
    movie_director_name VARCHAR(100) NOT NULL,
    movie_description TEXT NOT NULL, 
    movie_duration TIME NOT NULL,
    movie_rating INT DEFAULT 0,
    CHECK (movie_rating >= 0 AND movie_rating <= 10)
);

CREATE TABLE IF NOT EXISTS movie_genre_mapping (
    movie_id INT NOT NULL,
    movie_genre_id INT NOT NULL,

    PRIMARY KEY (movie_id, movie_genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_genre_id) REFERENCES movie_genres(movie_genre_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS movie_images (
    movie_image_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    movie_image_location TEXT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

CREATE TABLE IF NOT EXISTS theatres (
    theatre_id INT PRIMARY KEY AUTO_INCREMENT,
    theatre_name VARCHAR(100) NOT NULL,
    theatre_location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS theatre_users (
    theatre_user_id INT PRIMARY KEY AUTO_INCREMENT,
    theatre_user_full_name VARCHAR(100) NOT NULL,
    theatre_user_email VARCHAR(255) UNIQUE NOT NULL,
    theatre_user_password VARCHAR(255) NOT NULL,
    theatre_id INT,  
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE IF NOT EXISTS screens (
    screen_id INT PRIMARY KEY AUTO_INCREMENT,
    screen_name VARCHAR(50) NOT NULL,
    screen_total_seats INT NOT NULL,

    theatre_id INT,
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE IF NOT EXISTS seat_types (
    seat_type_id INT PRIMARY KEY AUTO_INCREMENT,
    seat_type_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    seat_number INT NOT NULL,
    row_num VARCHAR(5) NOT NULL,
    screen_id INT,
    UNIQUE(screen_id, seat_number, row_num),
    seat_type_id INT,
    FOREIGN KEY(screen_id) REFERENCES screens(screen_id),
    FOREIGN KEY(seat_type_id) REFERENCES seat_types(seat_type_id)

);

CREATE TABLE IF NOT EXISTS showtimes (
    showtime_id INT PRIMARY KEY AUTO_INCREMENT,

    showtime_start_time DATETIME NOT NULL,
    -- derived entity
    showtime_end_time DATETIME NOT NULL,

    -- foreign keys
    movie_id INT,
    screen_id INT,

    -- dependencies
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id)
);


CREATE TABLE IF NOT EXISTS pricings (
    pricing_id INT PRIMARY KEY AUTO_INCREMENT,
    price DECIMAL(10, 2) NOT NULL,

    -- foreign keys
    screen_id INT,
    showtime_id INT,
    seat_type_id INT,

    UNIQUE(screen_id, showtime_id, seat_type_id),

    -- dependencies
    CHECK (price >= 0),

    FOREIGN KEY (screen_id) REFERENCES screens(screen_id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),
    FOREIGN KEY (seat_type_id) REFERENCES seats(seat_type_id)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_total_seats INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- derived
    booking_total_amount DECIMAL(10, 2) NOT NULL,

    -- foreign keys
    customer_id INT,
    showtime_id INT,
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),

    -- checks
    CHECK (booking_total_seats > 0),
    CHECK (booking_total_amount >= 0)
);

CREATE TABLE IF NOT EXISTS booking_seats (
    booking_seat_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_id INT,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE,
    showtime_id INT,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE,    
    
    UNIQUE(showtime_id, seat_id)
);