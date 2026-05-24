const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signupValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/user");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const requestRouter = require("./router/requestRouter");
const userRouter = require("./router/userRouter");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);
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
