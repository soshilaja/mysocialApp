// Importing the User model for interacting with the user collection in the database.
import User from "../models/user.model.js";

// Importing a custom error handler for database-related errors.
import createError from "../helpers/dbErrorHandler.js";

import { logout } from "../controllers/auth.controller.js";

//Controller function to retrieve a specific user by their ID.
export const getUser = async (req, res, next) => {
  // Finding the user by their ID while excluding certain fields from the result.
  const user = await User.findById(req.params.id).select({
    password: 0,
    email: 0,
    createdAt: 0,
    updatedAt: 0,
    _id: 0,
    __v: 0,
  });

  // Sending a 200 OK response with the user data.
  res.status(200).send(user);
};

//Controller function to retrieve all users with certain fields excluded.
export const getUsers = async (req, res, next) => {
  try {
    // Finding all users while excluding certain fields from the result.
    const users = await User.find({}).select({
      password: 0,
      email: 0,
      createdAt: 0,
      updatedAt: 0,
      _id: 0,
      __v: 0,
    });

    // Sending a 200 OK response with the users' data.
    res.status(200).send(users);
  } catch (error) {
    // Sending a 500 Internal Server Error response if an error occurs.
    res.status(500).send("An error occurred while getting users");
  }
};

// Controller function to delete a user by their ID.
export const deleteUser = async (req, res, next) => {
  try {
    // Finding the user by their ID.
    const user = await User.findById(req.params.id);

    // Checking if the authenticated user is attempting to delete their own account.
    if (req.user !== user._id.toString()) {
      return next(createError(403, "You can only delete your own account!"));
    }

    // Deleting the user by their ID.
    await User.findByIdAndDelete(req.params.id);
    
    // Clearing the 'accessToken' cookie to log the user out.
    res.clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    });

    // Sending a 200 OK response to indicate successful logout.
    res
      .status(200)
      .send("User User deleted and logged out successfully");
  } catch (error) {
    // Sending a 500 Internal Server Error response if an error occurs.
    res.status(500).send("An error occurred while deleting the user.");
  }
};
