const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const { _id } = jwt.verify(token, "JustMatch@24846826");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports = { userAuth };
