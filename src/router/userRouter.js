const express = require("express");
const { userAuth } = require("../middlewares/user");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    res.json({
      success: true,
      data: pendingConnectionRequests,
      message: "All pending requests fetched successfully",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allAcceptedConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", "firstName lastName");
    const data = allAcceptedConnections.map(
      (connection) => connection.fromUserId,
    );
    res.json({
      success: true,
      data,
      message: "All connections fetched successfully",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
