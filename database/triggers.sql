DELIMITER //

CREATE TRIGGER normalize_customer_details_before_insert
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    SET NEW.customer_full_name = UPPER(NEW.customer_full_name);
    SET NEW.customer_email = LOWER(NEW.customer_email);
END //

CREATE TRIGGER enter_new_customer_in_logs
AFTER INSERT ON customers
FOR EACH ROW
BEGIN

    INSERT INTO customer_logs (customer_id, customer_full_name, customer_email, customer_action)
    VALUES (NEW.customer_id, NEW.customer_full_name, NEW.customer_email, "CREATED NEW ACCOUNT");

END //

CREATE TRIGGER log_old_customer_in_logs
BEFORE DELETE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO customer_logs (customer_id, customer_full_name, customer_email, customer_action)
    VALUES (OLD.customer_id, OLD.customer_full_name, OLD.customer_email, "DELETE ACCOUNT");
END //

CREATE TRIGGER log_customer_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN

    DECLARE customerFullName VARCHAR(100);
    DECLARE customerEmail VARCHAR(255);

    SELECT customer_full_name, customer_email INTO customerFullName, customerEmail
    FROM customers
    WHERE customer_id = NEW.customer_id;

    INSERT INTO customer_logs (customer_id, customer_full_name, customer_email, customer_action)
    VALUES (NEW.customer_id, customerFullName, customerEmail, "BOOKED MOVIE");

END //

DELIMITER ;