-- PUBLIC
CREATE VIEW public_customer_view AS 
    SELECT
        customer_id,
        customer_full_name,
        customer_email,
        customer_phone
    FROM
        customers;

CREATE VIEW movie_details AS
    SELECT
        movies.movie_id,
        movies.movie_title,
        movies.movie_director_name,
        movies.movie_description,
        movies.movie_duration,
        movies.movie_rating,
        movie_genres.movie_genre_name
    FROM
        movies
    JOIN
        movie_genre_mapping
    ON movies.movie_id = movie_genre_mapping.movie_id
    JOIN
        movie_genres
    ON movie_genre_mapping.movie_genre_id = movie_genres.movie_genre_id;

CREATE VIEW movie_image_details AS
    SELECT
        movies.movie_id,
        movies.movie_title,
        movie_images.movie_image_location
    FROM
        movie_images
    INNER JOIN
        movies
    ON
        movie_images.movie_id = movies.movie_id;

CREATE VIEW screen_details AS
    SELECT
        screens.*,
        theatres.theatre_name,
        theatres.theatre_location
    FROM
        screens
    INNER JOIN theatres
    ON screens.theatre_id = theatres.theatre_id;

CREATE VIEW seat_details AS
    SELECT
        seats.seat_id,
        seats.row_num,
        seats.seat_number,
        seats.seat_type_id,
        seat_types.seat_type_name,
        screen_details.*
    FROM
        seats
    INNER JOIN seat_types
    ON seats.seat_type_id = seat_types.seat_type_id
    INNER JOIN screen_details
    ON seats.screen_id = screen_details.screen_id;

CREATE VIEW showtimes_details AS 
    SELECT
        showtimes.showtime_id,
        showtimes.showtime_start_time,
        showtimes.showtime_end_time,
        movies.movie_id,
        movies.movie_title,
        movies.movie_director_name,
        screen_details.*
    FROM
        showtimes
    INNER JOIN movies
    ON showtimes.movie_id = movies.movie_id
    INNER JOIN screen_details
    ON showtimes.screen_id = screen_details.screen_id;


CREATE VIEW booking_details AS 
    SELECT
        bookings.booking_id,
        bookings.booking_total_seats,
        bookings.booking_date,
        bookings.booking_total_amount,
        customers.customer_id,
        customers.customer_full_name,
        customers.customer_email,
        customers.customer_phone,
        showtimes_details.*
    FROM
        bookings
    INNER JOIN customers ON customers.customer_id = bookings.customer_id
    INNER JOIN showtimes_details ON showtimes_details.showtime_id = bookings.showtime_id;

-- SHOW FULL TABLES IN dbms_project;