DELIMITER //

CREATE PROCEDURE book_movie(
    IN p_customer_id INT,
    IN p_showtime_id INT,
    IN p_seat_ids VARCHAR(255)
)
BEGIN
    DECLARE total_price DECIMAL(10, 2);
    DECLARE total_seats INT;
    DECLARE screen_id INT;
    DECLARE booking_id INT;

    DECLARE seat_id INT;
    DECLARE seat_ids_cursor CURSOR FOR 
        SELECT seat_id 
        FROM seats 
        WHERE seat_id IN (p_seat_ids);

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET seat_id = NULL;


    -- Start the transaction
    START TRANSACTION;

    -- Step 1: Check if all seats for the particular showtime are NOT present in the booking_seats table
    IF EXISTS (
        SELECT 1 
        FROM booking_seats bs 
        WHERE bs.seat_id IN (p_seat_ids) 
        AND bs.showtime_id = p_showtime_id
    ) THEN
        -- Rollback the transaction if any seat is already booked
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'One or more seats are already booked for this showtime.';
    ELSE
        -- Step 2: Create an entry in the bookings table
        -- First, fetch screen_id from the showtimes table using the showtime_id
        SELECT screen_id INTO screen_id
        FROM showtimes
        WHERE showtime_id = p_showtime_id;

        -- Fetch the booking total amount using the custom function
        SET total_price = calculate_booking_price(p_seat_ids, screen_id, p_showtime_id);
        
        -- Calculate the total number of seats
        SET total_seats = (SELECT COUNT(*) FROM seats WHERE seat_id IN (p_seat_ids));

        -- Insert into the bookings table
        INSERT INTO bookings (booking_total_seats, customer_id, showtime_id, booking_total_amount)
        VALUES (total_seats, p_customer_id, p_showtime_id, total_price);

        -- Get the newly created booking_id
        SET booking_id = LAST_INSERT_ID();

        -- Step 3: Insert entries into booking_seats for each seat in seat_ids

        OPEN seat_ids_cursor;

        read_loop: LOOP
            FETCH seat_ids_cursor INTO seat_id;
            
            IF seat_id IS NULL THEN
                LEAVE read_loop;
            END IF;

            -- Insert into booking_seats
            INSERT INTO booking_seats (booking_id, seat_id, showtime_id)
            VALUES (booking_id, seat_id, p_showtime_id);
        END LOOP;

        CLOSE seat_ids_cursor;

        -- Commit the transaction
        COMMIT;
    END IF;

END //

DELIMITER ;
