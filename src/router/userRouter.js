const express = require("express");
const { userAuth } = require("../middlewares/user");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const SAFE_TEXT = "firstName lastName age gender photourl skills about";

userRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_TEXT);
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
    })
      .populate("fromUserId", SAFE_TEXT)
      .populate("toUserId", SAFE_TEXT);
    const data = allAcceptedConnections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    const skip = (page - 1) * limit;

    const allUsers = await User.find({});

    const allConnectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    allConnectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_TEXT).skip(skip).limit(limit);

    res.json({
      success: true,
      data: users,
      message: "All feeds fetched successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
