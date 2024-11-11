# Theatre Management Service

This service allows for managing theatres, screens, users, and seat information. All routes are prefixed with `/api/v1/`.

## API Routes

### 1. **/api/v1/seat-types**
   - **Method**: `GET`
   - **Description**: Retrieves a list of seat types.
   - **Response**:
     ```json
     [
       {
         "seat_type_id": 1,
         "seat_type_name": "Premium"
       },
       {
         "seat_type_id": 2,
         "seat_type_name": "Regular"
       }
     ]
     ```

### 2. **/api/v1/theatres**
   - **Method**: `GET`
   - **Description**: Retrieves a list of all theatres.
   - **Response**:
     ```json
     [
       {
         "theatre_id": 1,
         "theatre_name": "Cinema Hall 1",
         "theatre_location": "Location 1"
       },
       {
         "theatre_id": 2,
         "theatre_name": "Cinema Hall 2",
         "theatre_location": "Location 2"
       }
     ]
     ```

   - **Method**: `POST`
   - **Description**: Creates a new theatre.
   - **Payload**:
     ```json
     {
       "theatre_name": "Cinema Hall 3",
       "theatre_location": "Location 3"
     }
     ```
   - **Response**:
     ```json
     {
       "theatre_id": 3,
       "theatre_name": "Cinema Hall 3",
       "theatre_location": "Location 3"
     }
     ```

### 3. **/api/v1/theatres/:theatre_id**
   - **Method**: `GET`
   - **Description**: Retrieves a specific theatre by its `theatre_id`.
   - **Response**:
     ```json
     {
       "theatre_id": 1,
       "theatre_name": "Cinema Hall 1",
       "theatre_location": "Location 1"
     }
     ```

   - **Method**: `PATCH`
   - **Description**: Updates a specific theatre’s name or location.
   - **Payload**:
     ```json
     {
       "theatre_name": "Updated Cinema Hall",
       "theatre_location": "New Location"
     }
     ```
   - **Response**:
     ```json
     {
       "success": "Theatre updated successfully"
     }
     ```

### 4. **/api/v1/theatres/:theatre_id/users**
   - **Method**: `GET`
   - **Description**: Retrieves all users working in a specific theatre.
   - **Response**:
     ```json
     [
       {
         "theatre_user_id": 1,
         "theatre_user_full_name": "John Doe",
         "theatre_user_email": "john@example.com"
       },
       {
         "theatre_user_id": 2,
         "theatre_user_full_name": "Jane Smith",
         "theatre_user_email": "jane@example.com"
       }
     ]
     ```

   - **Method**: `POST`
   - **Description**: Adds a new user to a specific theatre.
   - **Payload**:
     ```json
     {
       "theatre_user_full_name": "John Doe",
       "theatre_user_email": "john@example.com",
       "theatre_user_password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "success": "User created successfully"
     }
     ```

### 5. **/api/v1/theatres/:theatre_id/screens**
   - **Method**: `GET`
   - **Description**: Retrieves all screens in a specific theatre.
   - **Response**:
     ```json
     [
       {
         "theatre_id": 1,
         "theatre_name": "Cinema Hall 1",
         "screen_id": 1,
         "screen_name": "Screen 1",
         "screen_total_seats": 100
       },
       {
         "theatre_id": 1,
         "theatre_name": "Cinema Hall 1",
         "screen_id": 2,
         "screen_name": "Screen 2",
         "screen_total_seats": 150
       }
     ]
     ```

   - **Method**: `POST`
   - **Description**: Adds a new screen to a specific theatre.
   - **Payload**:
     ```json
     {
       "screen_name": "Screen 3",
       "screen_total_seats": 200
     }
     ```
   - **Response**:
     ```json
     {
       "screen": {
         "screen_id": 3,
         "theatre_id": 1,
         "screen_name": "Screen 3",
         "screen_total_seats": 200
       }
     }
     ```

### 6. **/api/v1/theatres/:theatre_id/screens/:screen_id**
   - **Method**: `GET`
   - **Description**: Retrieves a specific screen by `screen_id`.
   - **Response**:
     ```json
     {
       "screen_name": "Screen 1",
       "screen_total_seats": 100
     }
     ```

   - **Method**: `PATCH`
   - **Description**: Updates a screen’s name or total seats.
   - **Payload**:
     ```json
     {
       "screen_name": "Updated Screen",
       "screen_total_seats": 120
     }
     ```
   - **Response**:
     ```json
     {
       "success": "Screen updated successfully"
     }
     ```

### 7. **/api/v1/theatres/:theatre_id/screens/:screen_id/seats**
   - **Method**: `GET`
   - **Description**: Retrieves all seats in a specific screen.
   - **Response**:
     ```json
     [
       {
         "seat_id": 1,
         "row_num": "A",
         "seat_number": 1,
         "seat_type_id": 1,
         "seat_type_name": "Premium"
       },
       {
         "seat_id": 2,
         "row_num": "A",
         "seat_number": 2,
         "seat_type_id": 2,
         "seat_type_name": "Regular"
       }
     ]
     ```

   - **Method**: `POST`
   - **Description**: Adds new seats to a specific screen.
   - **Payload**:
     ```json
     {
       "seats": [
         {
           "row_num": "B",
           "seat_number": 3,
           "seat_type_id": 1
         },
         {
           "row_num": "B",
           "seat_number": 4,
           "seat_type_id": 2
         }
       ]
     }
     ```
   - **Response**:
     ```json
     {
       "success": "Seats added successfully"
     }
     ```



### 8. `/theatres/:theatre_id/screens/:screen_id/showtimes`

#### GET Request

Retrieve all showtimes for a specific screen.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes`
- **Method**: `GET`
- **Query Parameters**:
  - `upcoming`: (optional) Set to `true` to return only showtimes that start from today onward.
- **Response**:
  ```json
  [
    {
      "showtime_id": 1,
      "screen_id": 1,
      "movie_id": 101,
      "showtime_start_time": "2024-10-06T10:00:00",
      "showtime_end_time": "2024-10-06T12:00:00"
    },
    ...
  ]
  ```

#### POST Request

Create a new showtime for a specific screen.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "movie_id": 101,
    "showtime_start_time": "2024-10-06T10:00:00"
  }
  ```
- **Response**:
  ```json
  {
    "showtime": {
      "showtime_id": 1,
      "screen_id": 1,
      "movie_id": 101,
      "showtime_start_time": "2024-10-06T10:00:00",
      "showtime_end_time": "2024-10-06T12:00:00"
    }
  }
  ```

---

### 9. `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id`

#### GET Request

Retrieve details of a specific showtime.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "screen_id": 1,
    "movie_id": 101,
    "showtime_start_time": "2024-10-06T10:00:00",
    "showtime_end_time": "2024-10-06T12:00:00"
  }
  ```

#### PATCH Request

Update a showtime's details.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id`
- **Method**: `PATCH`
- **Payload** (at least one field is required):
  ```json
  {
    "movie_id": 102,
    "screen_id": 1,
    "showtime_start_time": "2024-10-06T11:00:00",
    "showtime_end_time": "2024-10-06T13:00:00"
  }
  ```
- **Response**:
  ```json
  {
    "success": "Showtime updated successfully"
  }
  ```

---

### 10. `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings`

#### GET Request

Retrieve the pricing information for a specific showtime.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "showtime_id": 1,
    "screen_id": 1,
    "pricing": [
      {
        "pricing_id": 1,
        "price": 100,
        "seat_type_id": 2
      },
      ...
    ]
  }
  ```

#### POST Request

Create new pricing for a specific showtime.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "price": 100,
    "seat_type_id": 2
  }
  ```
- **Response**:
  ```json
  {
    "showtime_id": 1,
    "screen_id": 1,
    "pricing": {
      "pricing_id": 1,
      "price": 100,
      "seat_type_id": 2
    }
  }
  ```

---

### 11. `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings/:pricing_id`

#### GET Request

Retrieve details of specific pricing.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings/:pricing_id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "pricing_id": 1,
    "price": 100,
    "screen_id": 1,
    "showtime_id": 1,
    "seat_type_id": 2
  }
  ```

#### PATCH Request

Update specific pricing information.

- **URL**: `/theatres/:theatre_id/screens/:screen_id/showtimes/:showtime_id/pricings/:pricing_id`
- **Method**: `PATCH`
- **Payload** (at least one field is required):
  ```json
  {
    "price": 120,
    "seat_type_id": 3
  }
  ```
- **Response**:
  ```json
  {
    "success": "Pricing updated successfully",
    "pricing": {
      "pricing_id": 1,
      "price": 120,
      "seat_type_id": 3,
      "screen_id": 1,
      "showtime_id": 1
    }
  }
  ```

---

## Error Handling

- If a request fails, the API returns an error message in the following format:
  ```json
  {
    "error": "Error message"
  }
