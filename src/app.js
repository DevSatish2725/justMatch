const express = require("express");
const connectDB = require("./config/database");
const User = require("./config/models/user");

const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("Error while adding user." + err.message);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("User updated successfully.");
  } catch (err) {
    res.status(400).send("Error while updating an user.");
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
