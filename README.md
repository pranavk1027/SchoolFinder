# School Management API

A Node.js API for managing school data with proximity-based search functionality.

## Features

- Add new schools with location data
- List schools sorted by proximity to a given location

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=school_management
     PORT=3000
     ```

4. Set up the database

## Running the Application

Start the server:
```
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Add School

- **URL**: `/api/addSchool`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.345678,
    "longitude": 98.765432
  }
  ```
- **Response**: 
  ```json
  {
    "message": "School added successfully",
    "schoolId": 1
  }
  ```

### List Schools

- **URL**: `/api/listSchools?latitude=12.345678&longitude=98.765432`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 12.345678,
      "longitude": 98.765432,
      "distance": 0.5
    }
  ]
  ```

## Error Handling

The API returns appropriate HTTP status codes:
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Server Error 
