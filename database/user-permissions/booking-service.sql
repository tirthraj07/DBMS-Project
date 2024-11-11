GRANT SELECT ON dbms_project.customers TO 'booking-service'@'%';
GRANT SELECT ON dbms_project.customer_logs TO 'booking-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.bookings  TO 'booking-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.booking_seats TO 'booking-service'@'%';
GRANT SELECT ON dbms_project.pricings TO 'booking-service'@'%';
GRANT SELECT ON dbms_project.showtimes TO 'booking-service'@'%';
GRANT SELECT ON dbms_project.seats TO 'booking-service'@'%';

GRANT SELECT ON dbms_project.booking_details TO 'booking-service'@'%';
GRANT SELECT ON dbms_project.public_customer_view TO 'booking-service'@'%';

GRANT EXECUTE ON PROCEDURE dbms_project.book_movie TO 'booking-service'@'%';
GRANT EXECUTE ON FUNCTION dbms_project.calculate_booking_price TO 'booking-service'@'%';

FLUSH PRIVILEGES;