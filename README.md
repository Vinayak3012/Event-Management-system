# Event-Management-system

#  Event Management REST API

A RESTful API to manage users, events, and registrations using **Node.js**, **Express**, and **PostgreSQL**.  
It supports event creation, user registration, and listing upcoming events.

---

##  Setup Instructions

### 1. Clone the Repository
git clone https://github.com/Vinayak3012/Event-Management-system.git
cd event-management-api

### 2. Install Dependencies
npm install

### 3. Configure Environment
Create .env file in the root folder

PORT=5000
DB_USER=your_postgres_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eventdb

### 4. Setup PostgreSQL Tables
Run this SQL in your PostgreSQL client

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  capacity INT NOT NULL CHECK (capacity BETWEEN 1 AND 1000)
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  UNIQUE(user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

## API Endpoints


Event Management REST API - Endpoint Reference
---------------------------------------------

Base URL: /api

--------------------------
USERS
--------------------------

POST /api/user
- Description: Create a new user
- Request Body (JSON):
  {
    "name": "Vinayak",
    "email": "vinayak@example.com"
  }
- Response (JSON):
  {
    "user_id": 1,
    "message":"Users Created Successfully!"
  }

--------------------------
EVENTS
--------------------------

POST /api/event
- Description: Create a new event
- Request Body (JSON):
  {
    "title": "Tech Expo",
    "date_time": "2025-08-01T10:00:00",
    "location": "Mumbai",
    "capacity": 300
  }
  - Response (JSON):
  {
    "event_id": 1,
     "message": "Event Created Successfully"
  }

GET /api/event/upcoming
- Description: Get upcoming (future) events only
- Sorted by date (ASC), then location (A-Z)
- Response:
  [
    {
      "id": 1,
      "title": "Tech Expo",
      "date_time": "2025-08-01T10:00:00",
      "location": "Mumbai",
      "capacity": 300
    }
  ]

--------------------------
REGISTRATIONS
--------------------------

POST /api/registration
- Description: Register a user for an event
- Request Body (JSON):
  {
    "user_id": 1,
    "event_id": 1
  }
- Response (JSON):
- {
  "message": "Registration Completed Successfully!"
  }

  GET /api/registration/all
- Description: Get all events with registered users
- Response: List of events with registered users

DELETE /api/registrations/cancel/:user_id/:event_id
- Description: Cancel a user's registration for an event
- Example: /api/registrations/1/1
- Success Response:
  {
    "message": "Registration Cancel Successfully!"
  }
- Not Found Response:
  {
    "message": "User Wasn't Registered"
  }

 GET  /api/registrations/status/:event_id
- Description: Get Particular Event Stat or Status
 Example: /api/registrations/status/1
- Response (JSON):
- {
  "number_of_registrations": 1,
      "remaining_capacity": 299,
      "percentage_capacity_used": 0.66667,
    }

##Testing
Use Postman or hoppscotch to test endpoints. Make sure your PostgreSQL server is running and connected properly.





