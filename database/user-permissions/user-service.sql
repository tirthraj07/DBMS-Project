GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.customers TO 'customer-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.customer_logs TO 'customer-service'@'%';
GRANT SELECT dbms_project.booking_seats TO 'customer-service'@'%';


GRANT SELECT ON dbms_project.booking_details TO 'customer-service'@'%';
GRANT SELECT ON dbms_project.public_customer_view TO 'customer-service'@'%';

FLUSH PRIVILEGES;