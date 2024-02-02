// The following code sets up the authentication routes using Express and the auth.controller module.

// Importing the Express framework for building web applications in Node.js.
import express from "express";

// Importing functions from the auth.controller module to handle authentication-related operations.
import {
  createUser, // Function to handle user registration
  updateUser, // Function to handle user profile updates
  login, // Function to handle user login
  logout, // Function to handle user logout
} from "../controllers/auth.controller.js";

// Importing the verifyToken function from the jwt middleware module.
// This function is used to verify the authenticity of JWT (JSON Web Tokens) for secure routes.
import { verifyToken } from "../middleware/jwt.js";

// Creating an instance of the Express Router to define routes for authentication operations.
const router = express.Router();

// Defining a route for user registration.
router.post("/register", createUser);

// Defining a route for user login.
router.post("/login", login);

// Defining a route for user logout.
router.post("/logout", logout);

// Defining a route for updating user profiles.
router.put("/update/:id", verifyToken, updateUser);

// Exporting the configured router to be used in other parts of the application.
export default router;
