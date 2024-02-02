// Importing the Mongoose library, which is a MongoDB object modeling tool designed to work in an asynchronous environment.
import mongoose from "mongoose";

// Extracting the Schema class from the mongoose object for defining the structure of the MongoDB documents.
const { Schema } = mongoose;

// Defining a Mongoose schema for the 'User' model.
const UserSchema = new Schema(
  {
    // Defining a field for the user's username.
    username: {
      type: String, // Data type: String
      trim: true, // Trimming leading and trailing whitespaces from the input
      required: true, // Field is required
    },

    // Defining a field for the user's email address.
    email: {
      type: String, // Data type: String
      trim: true, // Trimming leading and trailing whitespaces from the input
      unique: true, // Ensuring email addresses are unique in the collection
      // Using a regular expression to enforce a valid email format.
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regular expression for a valid email
        "Please fill a valid email address", // Error message if the match fails
      ],
      required: true, // Field is required
    },

    // Defining a field for the user's password.
    password: {
      type: String, // Data type: String
      // Using a regular expression to enforce a valid password format.
      match: [
        /^(?=.*[a-zA-Z\u0400-\u04FF])(?=.*\d)(?=.*[~!@#$%^&*_+()\[\]{}><\\/|"'.,:;])(?!.*\s).{8,128}$/, // Regular expression for a valid password
        "Your password muct contain atleast 8 characters, No more than 128 characters, At least one uppercase and one lowercase letter. At least one numeral, No spaces", // Error message if the match fails
      ],
      required: true, // Field is required
    },
  },
  { timestamps: true } // Adding automatic timestamp fields for 'createdAt' and 'updatedAt'
);

// Exporting the Mongoose model named 'User' based on the defined schema.
export default mongoose.model("User", UserSchema);