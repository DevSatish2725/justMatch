const express = require("express");
const { userAuth } = require("../middlewares/user");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    if (!["interested", "ignored"].includes(status)) {
      throw new Error(`${status} is not valid status type`);
    }

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const isToUserExist = await User.findById(toUserId);
    if (!isToUserExist) {
      return res.status(404).json({
        success: false,
        message: "Connection request can't be send",
      });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (existingConnectionRequest) {
      throw new Error("Connection request already exist");
    }

    const { firstName } = req.user;
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      success: true,
      data,
      message: `${firstName} sent you connection request`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    if (!["accepted", "rejected"].includes(status)) {
      throw new Error(`${status} in not a valid status type`);
    }
    const loggedInUser = req.user;
    const isValidConnectionRequestExist = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!isValidConnectionRequestExist) {
      return res.status(400).json({
        success: false,
        message: "Connection request is not exist",
      });
    }
    isValidConnectionRequestExist.status = status;
    const data = await isValidConnectionRequestExist.save();
    res.json({
      success: true,
      data,
      message: `Connection request ${status}`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = requestRouter;
