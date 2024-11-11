-- 1. Grant read/write permissions on the tables
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.movies TO 'movies-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.movie_genre_mapping TO 'movies-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.movie_images TO 'movies-service'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbms_project.movie_genres TO 'movies-service'@'%';

-- 2. Grant read-only permissions on the views
GRANT SELECT ON dbms_project.movie_details TO 'movies-service'@'%';
GRANT SELECT ON dbms_project.movie_image_details TO 'movies-service'@'%';

-- 3. Apply the changes
FLUSH PRIVILEGES;