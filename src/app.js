const express = require("express");
const connectDB = require("./config/database");
const User = require("./config/models/user");
const { signupValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  try {
    const errors = signupValidation(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      about,
      photoUrl,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase().trim(),
      password: passwordHash,
      gender,
      age,
      about,
      photoUrl,
      skills,
    });
    if (Object.keys(errors).length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const convertToLowercase = emailId ? emailId.toLowerCase() : "";
    const user = await User.findOne({ emailId: convertToLowercase });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfull");
    }
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try {
    res.send("Sending connection request...");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error(`Getting ${err} while connecting to the database.`);
  });
