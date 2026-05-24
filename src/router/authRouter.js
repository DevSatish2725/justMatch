const express = require("express");
const { signupValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const validationDetails = signupValidation(req);
    if (Object.keys(validationDetails).length) {
      return res.status(400).json({
        success: false,
        errors: validationDetails,
      });
    }
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      skills,
      photoUrl,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: passwordHash,
      age,
      gender,
      about,
      photoUrl,
      skills,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "Signup successfull",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatched = await user.validatePassword(password);
    if (!isPasswordMatched) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ _id: user._id }, "JustMatch@24846826", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.status(200).json({
      success: true,
      message: "Login successfull",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({
    success: true,
    message: "Logout successfull",
  });
});

module.exports = authRouter;
