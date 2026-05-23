const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    emailId: {
      type: String,
      unique: true,
    },
    password: String,
    gender: String,
    age: Number,
    about: String,
    photoUrl: String,
    skills: [String],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
