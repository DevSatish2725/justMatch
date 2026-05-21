const express = require("express");

const app = express();

app.use("/career", (req, res) => {
  res.send("Career");
});
app.use("/", (req, res) => {
  res.send("Home");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
