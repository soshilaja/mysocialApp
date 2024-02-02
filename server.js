// Importing necessary dependencies and modules
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./routes/user.routes.js";
import authRoute from "./routes/auth.routes.js";

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Function to connect to MongoDB
const connect = async () => {
  try {
    // Connect to MongoDB using the provided URI from the environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

// Middleware setup
// Enable Cross-Origin Resource Sharing (CORS) for requests from http://localhost:3000
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Parse cookies in the incoming requests
app.use(cookieParser());

// Parse JSON data in the incoming requests
app.use(express.json());

// Parse JSON data in the incoming requests using bodyParser
app.use(bodyParser.json());

// Import routes for handling user-related operations
app.use("/api/users", userRoute);

// Import routes for handling authentication-related operations
app.use("/api/auth", authRoute);

// Error handling middleware
app.use((error, req, res, next) => {
  // Extract status and message from the error object or provide defaults
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong";

  // Send the appropriate status and error message as the response
  return res.status(errorStatus).send(errorMessage);
});

// Set the port for the server to run on, defaulting to 8080 if not provided
const PORT = process.env.PORT || 8080;

// Start the server and connect to MongoDB
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
