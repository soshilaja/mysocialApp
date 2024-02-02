// Importing the User model for interacting with the user collection in the database.
import User from "../models/user.model.js";

// Importing the 'bcrypt' library for password hashing and comparison.
import bcrypt from "bcrypt";

// Importing the 'jsonwebtoken' library for generating and verifying JSON Web Tokens (JWTs).
import jwt from "jsonwebtoken";

// Importing a custom error handler for database-related errors.
import createError from "../helpers/dbErrorHandler.js";

// Controller function for creating a new user.
export const createUser = async (req, res, next) => {
  try {
    // Checking if a user with the same username or email already exists.
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    // If user already exists, sending a 409 Conflict response.
    if (existingUser) return res.status(409).send("User already exists");

    // Hashing the user's password before saving it to the database.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Creating a new user instance with the hashed password.
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Saving the new user to the database.
    await newUser.save();
    res.status(201).send("User created");
  } catch (error) {
    // Forwarding any errors to the next middleware.
    next(error);
  }
};

// Controller function for updating a user's information.
export const updateUser = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.cookies.accessToken) {
      return next(createError(401, "Login to update your account"));
    }

    // Retrieve the user from the database by ID.
    const user = await User.findById(req.params.id);

    // Check if the authenticated user is attempting to update their own account.
    if (req.user !== user._id.toString()) {
      return next(createError(403, "You can only update your own account"));
    }

    // Hash the user's password before saving it to the database if provided.
    let hashedPassword;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user's information and retrieve the updated user.
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...(hashedPassword ? { password: hashedPassword } : {}), ...req.body },
      {
        new: true, // Return the modified document rather than the original.
        useFindAndModify: false, // Avoid deprecated warning.
      }
    );

    // Send appropriate responses based on whether the update was successful.
    if (updatedUser) {
      res.status(200).send("Update successful");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    // Forward any errors to the next middleware.
    next(error);
  }
};

//Controller function for user login.
export const login = async (req, res, next) => {
  try {
    // Finding the user by their username.
    const user = await User.findOne({ username: req.body.username });

    // If the user is not found, sending a 404 Not Found response.
    if (!user) return next(createError(404, "User not found"));

    // Comparing the provided password with the hashed password in the database.
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is not valid, sending a 404 Not Found response.
    if (!validPassword) return next(createError(404, "Wrong user credentials"));

    // Creating a JWT token with the user's ID and signing it with the secret key.
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

    // Omitting the password field from the user's data.
    const { password, ...others } = user._doc;

    // Setting the JWT token as a cookie and sending the user's data in the response.
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .send(others);
  } catch (error) {
    // Forwarding any errors to the next middleware.
    next(error);
  }
};

//Controller function for user logout.
export const logout = async (req, res, next) => {
  try {
    // Clearing the 'accessToken' cookie to log the user out.
    res.clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    });

    // Sending a 200 OK response to indicate successful logout.
    res.status(200).send("User logged out successfully");
  } catch (error) {
    // Forwarding any errors to the next middleware.
    next(error);
  }
};
