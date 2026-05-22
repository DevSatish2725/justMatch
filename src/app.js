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
