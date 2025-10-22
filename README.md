# Dishcovery Backend

## Project Overview

Dishcovery is a full-stack application that allows users to discover, save, and manage recipes, cookbooks, and food items. This backend is built with Node.js, Express, and MongoDB, and provides a RESTful API to serve the frontend application.

Stage-2 focuses on the backend infrastructure, API routes, and proper configuration to ensure the server is functional, secure, and review-ready.

**Note:** The frontend is still in progress. This submission includes the complete and fully functional backend.

## Tech Stack

- Node.js — server runtime
- Express.js — web framework
- MongoDB + Mongoose — database and ORM
- JWT — authentication
- ESLint & Prettier — code quality and formatting
- Helmet — security headers
- Cors — cross-origin resource sharing
- Morgan — HTTP request logging
- Node-Fetch — external API requests (Spoonacular)

## Installation & Setup

1. Clone the repository and navigate to the backend folder.
2. Install dependencies using npm install.
3. Create a .env file based on .env.example and fill in configuration (PORT, MongoDB URI, JWT secret, Spoonacular API key).
4. Start the server:

   - npm run dev
   - npm start.

5. The server runs on the port specified in .env (default: 5000) and connects to MongoDB.

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

## Code Quality & Linting

- ESLint enforces consistent JavaScript standards.
- Prettier ensures uniform formatting.
- Logs are stored locally in logs/ and ignored in Git.

## Testing / Verification

After starting the server:

- curl http://localhost:5000/api/items
- curl "http://localhost:5000/api/items/search?q=pasta"
