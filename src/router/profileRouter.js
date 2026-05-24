const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/user");
const { signupValidation } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
      message: "Here is your profile data",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ];
    const isAllowedToUpdate = Object.keys(req.body).every((field) =>
      ALLOWED_UPDATES.includes(field),
    );

    if (!isAllowedToUpdate) {
      throw new Error("Invalid credentials");
    }
    const existingUserProfileDetails = req.user;
    Object.keys(req.body).forEach((key) => {
      existingUserProfileDetails[key] = req.body[key];
    });

    const validationDetails = signupValidation({
      body: existingUserProfileDetails,
    });
    if (Object.keys(validationDetails).length) {
      return res.status(400).json({
        success: false,
        errors: validationDetails,
      });
    }
    await existingUserProfileDetails.save();
    res.json({
      success: true,
      message: `${existingUserProfileDetails.firstName} your profile details updated.`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = profileRouter;
