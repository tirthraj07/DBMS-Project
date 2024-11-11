CREATE USER 'theatre-service'@'%' IDENTIFIED BY 'theatre-service';

-- 1. Grant read/write permissions on the tables
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.theatres TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.theatre_users TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.screens TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.seat_types TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.seats TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.showtimes TO 'theatre-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.pricings TO 'theatre-service'@'%';

GRANT SELECT ON dbms_project.movies TO 'theatre-service'@'%';

-- 2. Grant read-only permissions on the views
GRANT SELECT ON dbms_project.screen_details TO 'theatre-service'@'%';
GRANT SELECT ON dbms_project.seat_details TO 'theatre-service'@'%';
GRANT SELECT ON dbms_project.showtimes_details TO 'theatre-service'@'%';

-- 3. Apply the changes
FLUSH PRIVILEGES;