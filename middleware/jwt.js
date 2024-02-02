// Importing the 'jsonwebtoken' library for handling JSON Web Tokens (JWTs).
import jwt from "jsonwebtoken";

// Importing a custom error handler for database-related errors.
import createError from "../helpers/dbErrorHandler.js";

/**
 * Middleware function to verify the authenticity of a user's access token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const verifyToken = (req, res, next) => {
  // Extracting the JWT from the 'accessToken' cookie in the request.
  const token = req.cookies.accessToken;

  // If no token is present, sending a 401 Unauthorized response with an error message.
  if (!token) return next(createError(401, "You are not authenticated"));

  // Verifying the extracted token using the provided JWT key.
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    // If there's an error during verification, sending a 403 Forbidden response with an error message.
    if (err) {
      return next(createError(403, "Invalid token!"));
    }

    // If verification is successful, attaching the decoded user ID to the request.
    req.user = decoded.id;

    // All checks passed, allowing the request to proceed to the next middleware or route.
    next();
  });
};
