# Dishcovery Backend

A secure and scalable RESTful API built with Node.js, Express, and MongoDB to power the Dishcovery platform. It handles user authentication, recipe and item management, data storage, and external API integration, serving as the core of the full-stack application.

## Project Overview

Dishcovery is a full-stack application that allows users to discover, save, and manage recipes, cookbooks, and food items.  
The backend is built using **Node.js, Express, and MongoDB** and provides a fully functional **RESTful API** to support the frontend.

This backend includes:

- Authentication (JWT-based)
- CRUD operations for users, items, and recipes
- API integrations (Spoonacular)
- Secure deployment on HTTPS using SSL (Certbot)
- Server process management via PM2

## Tech Stack

| Category        | Tools / Technologies             |
| --------------- | -------------------------------- |
| Runtime         | Node.js                          |
| Framework       | Express.js                       |
| Database & ORM  | MongoDB + Mongoose               |
| Auth & Security | JWT, Helmet, CORS, Rate Limiting |
| Logging         | Morgan, Winston                  |
| Code Quality    | ESLint, Prettier                 |
| Deployment      | Nginx, PM2, Certbot SSL          |
| External API    | Spoonacular (node-fetch)         |

## Deployment URLs (Production)

### Backend API Base URL:

https://api.dishcovery.jumpingcrab.com

### Frontend URL:

https://dishcovery.jumpingcrab.com

### Redirect URLs:

https://dishcovery.jumpingcrab.com/profile  
https://api.dishcovery.jumpingcrab.com/api/signin  
https://api.dishcovery.jumpingcrab.com/api/signup

### Example Protected API Endpoint:

https://api.dishcovery.jumpingcrab.com/api/items
(Requires Authorization: Bearer <JWT>)

(All domains are HTTPS-enabled using SSL/TLS and Cerbot)

## Installation & Setup

1. Clone the repository and navigate to the backend folder.
2. Install dependencies using npm install.
3. Create a .env file based on .env.example and fill in configuration (PORT, MongoDB URI, JWT secret, Spoonacular API key):
4. PORT=5000
5. MONGO_URI=mongodb://127.0.0.1:27017/dishcovery
6. JWT_SECRET=super-secret-key
7. JWT_EXPIRES_IN=7d
8. RATE_LIMIT_WINDOW_MS=60000
9. RATE_LIMIT_MAX=100
10. NODE_ENV=development
11. SPOONACULAR_API_KEY=your_spoonacular_key
    Note: Ensure .env is in .gitignore to prevent secrets from being committed.
12. Start the server:
13. npm run dev # development mode
14. npm start # production mode
15. The server runs on the port specified in .env (default: 5000) and connects to MongoDB.

## Folder Structure

- src/config/ — configuration & logger
- src/controllers/ — route handlers
- src/middlewares/ — auth & error handlers
- src/models/ — Mongoose models
- src/routes/ — API routes
- src/utils/ — constants & custom errors
  Infra files: .env.example, .prettierrc, eslint.config.js, package.json, server.js

## API Endpoints

- Authentication: Sign up, Sign in (returns JWT)
- User: Get current user details (protected)
- Recipes: Fetch recipes (public), Add/Delete recipes (protected)
- Items & Cookbooks: Full CRUD, protected routes

Protected routes require a valid JWT in the Authorization header.

## Logging & Error Handling

- Express-winston logs errors and API requests to /logs/
- Centralized error handler returns consistent JSON responses
- Debug logs excluded from Git tracking

## Code Quality & Linting

- ESLint enforces consistent JavaScript standards.
- Prettier ensures uniform formatting.
- Logs are stored locally in logs/ and ignored in Git.

## Testing / Verification

### Sign in (get JWT)

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"your_password"}'
```

curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
http://localhost:5000/api/items
