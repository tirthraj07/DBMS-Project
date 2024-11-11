DELIMITER //

-- SELECT calculate_booking_price('1,2,3', 1, 2) AS total_price;

CREATE FUNCTION calculate_booking_price(seat_ids VARCHAR(255), screen_id INT, showtime_id INT)
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    DECLARE total_price DECIMAL(10, 2) DEFAULT 0.00;
    DECLARE seat_type_id INT;
    DECLARE current_price DECIMAL(10, 2);
    
    -- Declare a cursor for seat_ids
    DECLARE seat_cursor CURSOR FOR 
        SELECT seat_type_id 
        FROM seats 
        WHERE seat_id IN (seat_ids);
    
    -- Declare a CONTINUE HANDLER to handle the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET seat_type_id = NULL;

    -- Open the cursor
    OPEN seat_cursor;

    -- Loop through the seat_ids to calculate total price
    read_loop: LOOP
        FETCH seat_cursor INTO seat_type_id;
        
        IF seat_type_id IS NULL THEN
            LEAVE read_loop;
        END IF;

        -- Fetch the price for the current seat type, screen, and showtime
        SELECT p.price INTO current_price
        FROM pricings p
        WHERE p.seat_type_id = seat_type_id
          AND p.screen_id = screen_id
          AND p.showtime_id = showtime_id;

        -- Add the current price to the total price
        SET total_price = total_price + IFNULL(current_price, 0);
    END LOOP;

    -- Close the cursor
    CLOSE seat_cursor;

    RETURN total_price;
END //

DELIMITER ;
