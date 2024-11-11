# Database Setup

This folder contains all the SQL files necessary to set up the database schema, views, stored procedures, functions, triggers, and users for the Theatre Booking System. The database is designed to follow best practices in normalization, security, and data control, ensuring a scalable and secure architecture.

## Folder Structure

### Main Files

1. **schema.sql**  
   This file defines the entire database schema, including the creation of all tables, relationships (foreign keys), constraints, and checks. It covers the following entities:
   - **Customers**: Storing customer details like name, email, and phone number.
   - **Movies**: Storing movie information such as title, director, description, and rating.
   - **Theatres and Screens**: Captures theatre details and the configuration of screens (with seat layouts and types).
   - **Bookings**: Manages the booking data, including seat selection, showtime information, and pricing.
   - **Showtimes and Pricing**: Handles the scheduling of movie showtimes and related pricing for different seat types.

   The schema is designed with **normalization** to reduce redundancy and improve consistency. For specific optimization cases (like denormalization for performance), certain lookups are made faster by additional indexing.

2. **views.sql**  
   This file contains SQL queries to create **views** for easier data retrieval. These views consolidate information across multiple tables and are used to simplify complex queries. Some key views include:
   - **Customer View**: Simplifies fetching customer details along with their logs.
   - **Movie View**: Fetches movie details with associated genres and images.
   - **Booking View**: Aggregates booking information with showtimes and seat details for better reporting and analysis.

3. **procedures.sql**  
   Contains **stored procedures** that encapsulate commonly used operations within the database. Procedures help with:
   - Booking management (e.g., checking seat availability and calculating booking prices).
   - Automated operations that require complex logic, which might involve multiple steps or transactions.

4. **functions.sql**  
   Defines **user-defined functions (UDFs)** that perform calculations or operations needed across various queries. Functions include:
   - Calculating the **total amount** for a booking.
   - Utility functions to format or manipulate data during retrieval.

5. **triggers.sql**  
   This file includes all the **triggers** that automate certain actions within the database. Triggers help maintain data integrity and provide auditing by automating tasks like:
   - Logging customer actions (e.g., creating or deleting accounts, making bookings).
   - Normalizing customer input (e.g., ensuring emails are stored in lowercase).
   - Automatically updating log entries when important operations occur (e.g., customer bookings).

6. **users.sql**  
   Defines the database **users** and their roles. It ensures that each service (e.g., booking, movie, theatre) has **least privilege access** to the necessary tables. This improves security by limiting access to only the required parts of the database.

### user-permissions Folder

The **user-permissions** folder contains SQL scripts to set up the specific permissions for each service. Each service user has specific read/write access to the tables required for their functionality:
   
1. **booking-service.sql**  
   Manages the permissions for the **booking service**. This user has access to tables related to bookings, seats, and showtimes, with the ability to insert, update, and delete booking records.

2. **movie-service.sql**  
   Manages the permissions for the **movie service**. This user has access to tables related to movies, genres, and images, allowing CRUD operations on movie-related data.

3. **theatre-service.sql**  
   Manages the permissions for the **theatre service**. This user can access theatres, screens, and related data, with the ability to manage screen layouts and showtimes.

4. **user-service.sql**  
   Manages the permissions for the **customer service**. This user can access the customer table to handle operations such as user registration, authentication, and customer log management.

---

## Setting Up the Database

1. **Run schema.sql**  
   Begin by setting up the core database structure with all tables and relationships.

2. **Run views.sql**  
   Create useful views for simplifying complex queries and for easier access to joined data.

3. **Run procedures.sql**  
   Set up stored procedures that encapsulate repetitive logic, especially for booking management.

4. **Run functions.sql**  
   Add user-defined functions that are referenced by various queries and procedures.

5. **Run triggers.sql**  
   Set up triggers to ensure automatic logging and normalization of customer data.

6. **Run users.sql**  
   Create database users for each service, ensuring they have the correct privileges for interacting with the database.

7. **Run the scripts in the user-permissions folder**  
   Set up the least-privilege permissions for each service user to enhance security and control access to data.

8. **Run the scripts in the data folder**  
   The folder contains all the static data essential for the application to run.
