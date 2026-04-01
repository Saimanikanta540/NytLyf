# NytLyf Node.js Backend

This is the Node.js/Express.js backend for the NytLyf Event Discovery App. It provides a RESTful API powered by MongoDB.

## Features
- **Authentication**: JWT-based login/registration with hashed passwords (bcrypt).
- **Events**: Create, read, and search events with pagination.
- **Categories**: Event categorization.
- **User Actions**: Bookmark events and RSVP.
- **Error Handling**: Custom error middleware and input validation.

## Technology Stack
- Node.js & Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- `express-validator` for input validation

## Setup Instructions

### 1. Install dependencies
```bash
cd node-backend
npm install
```

### 2. Environment Variables
Rename `.env.example` to `.env` and fill in your configuration:
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: Your MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET`: A secret string for JWT token generation

### 3. Run the server

For development (uses nodemon to auto-restart on changes):
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token

### Events
- `GET /api/events` - Get all events (Supports pagination: `?page=1&limit=10`)
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events` - Create a new event (Requires Auth)
- `GET /api/events/category/:categoryId` - Get events by category ID
- `GET /api/events/search?q=keyword` - Search events by title

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category (Requires Auth)

### Users
- `POST /api/users/bookmark/:eventId` - Toggle bookmark for an event (Requires Auth)
- `GET /api/users/bookmarks` - Get logged-in user's bookmarked events (Requires Auth)
- `POST /api/users/rsvp/:eventId` - Toggle RSVP for an event (Requires Auth)
