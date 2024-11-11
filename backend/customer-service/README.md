Here's the `README.md` file for the customer service:


# Customer Service API

This is the Customer Service API that allows customers to manage their accounts, bookings, and logs. It also includes authentication for signup, login, and logout. The service runs on port **10,000**.

## Base URL
The API is accessible at:

http://localhost:10000/


## Authentication
The following APIs require authentication using a token. The token should be included in the request headers as `Authorization: Bearer <token>`.

### Routes Overview

- `/api/v1/` – Customer related routes (secured with JWT)
- `/auth/` – Authentication related routes (login, signup, and logout)

---

## Customer API Endpoints (`/api/v1/`)

### Get Customer Information


GET /api/v1/customer


- **Description**: Retrieve the currently logged-in customer's information.
- **Response**:
  - `200 OK`: Returns customer information.
  - `404 Not Found`: If the customer is not found.
  - `500 Internal Server Error`: If the database query fails.

---

### Update Customer Information


PATCH /api/v1/customer


- **Description**: Update customer profile information like name, email, phone number, or password.
- **Request Body**:
  - `customer_full_name` (optional): The full name of the customer.
  - `customer_email` (optional): The email of the customer.
  - `customer_phone` (optional): The phone number of the customer.
  - `customer_old_password` (required if updating password): The current password.
  - `customer_new_password` (optional): The new password to be set.
- **Response**:
  - `200 OK`: Returns success if the profile is updated.
  - `400 Bad Request`: If the old password is incorrect.
  - `500 Internal Server Error`: If the update fails.

---

### Delete Customer Account


DELETE /api/v1/customer


- **Description**: Deletes the currently logged-in customer's account and logs them out.
- **Response**:
  - `200 OK`: If the account is deleted and the user is logged out.
  - `404 Not Found`: If the customer is not found.
  - `500 Internal Server Error`: If the deletion fails.

---

### Get Customer Bookings


GET /api/v1/customer/bookings


- **Description**: Retrieve all bookings made by the customer.
- **Response**:
  - `200 OK`: Returns a list of bookings.
  - `404 Not Found`: If no bookings are found.
  - `500 Internal Server Error`: If the database query fails.

---

### Get Customer Logs


GET /api/v1/customer/logs


- **Description**: Retrieve logs related to customer actions.
- **Response**:
  - `200 OK`: Returns a list of logs.
  - `404 Not Found`: If no logs are found.
  - `500 Internal Server Error`: If the database query fails.

---

## Authentication API Endpoints (`/auth/`)

### Signup


POST /auth/signup


- **Description**: Create a new customer account.
- **Request Body**:
  - `customer_full_name` (required): The full name of the customer.
  - `customer_email` (required): The email of the customer.
  - `customer_password` (required): The password for the account.
  - `customer_phone` (required): The phone number of the customer.
- **Response**:
  - `200 OK`: Returns success if the signup is successful.
  - `400 Bad Request`: If required fields are missing.
  - `500 Internal Server Error`: If the signup fails.

---

### Login


POST /auth/login


- **Description**: Login as a customer.
- **Request Body**:
  - `customer_email` (required): The email of the customer.
  - `customer_password` (required): The password for the account.
- **Response**:
  - `200 OK`: Returns success if login is successful, and sets a token in a cookie.
  - `401 Unauthorized`: If credentials are incorrect.
  - `500 Internal Server Error`: If the login fails.

---

### Logout


POST /auth/logout


- **Description**: Logout the customer and clear the authentication token cookie.
- **Response**:
  - `200 OK`: Returns success if logout is successful.
  - `500 Internal Server Error`: If the logout fails.

---


