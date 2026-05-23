const express = require("express");
const connectDB = require("./config/database");
const User = require("./config/models/user");
const { signupValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
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
    console.log("email id", emailId);
    const convertToLowercase = emailId ? emailId.toLowerCase() : "";
    const user = await User.findOne({ emailId: convertToLowercase });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    res.send("Login successfull");
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});

// Feed API - GET/feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Error while fetching all users.");
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully.");
  } catch (err) {
    res.status(400).send("Getting error while deleting a user.", err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    const ALLOWED_UPDATES = [
      "userId",
      "firstName",
      "lastName",
      "skills",
      "about",
      "photoUrl",
    ];
    const isTrue = Object.keys(req.body).every((value) =>
      ALLOWED_UPDATES.includes(value),
    );
    if (!isTrue) {
      throw new Error("Email id can't update");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong.");
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
