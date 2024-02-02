// Importing the Express framework for building web applications in Node.js.
import express from "express";

// Importing specific functions from the user.controller module.
// These functions handle user-related operations such as fetching user details and deleting users.
import {
  getUser,
  getUsers,
  deleteUser,
} from "../controllers/user.controller.js";

// Importing the verifyToken function from the jwt middleware module.
// This function is used to verify the authenticity of JWT (JSON Web Tokens) for secure routes.
import { verifyToken } from "../middleware/jwt.js";

// Creating an instance of the Express Router to define routes for user-related operations.
const router = express.Router();

// Defining a route for fetching user details by ID.
router.get("/:id", getUser);

// Defining a route for fetching all users.
router.get("/", getUsers);

// Defining a route for deleting a user by ID.
// The verifyToken middleware is applied to ensure the request is authenticated with a valid JWT.
router.delete("/:id", verifyToken, deleteUser);

// Exporting the configured router to be used in other parts of the application.
export default router;
