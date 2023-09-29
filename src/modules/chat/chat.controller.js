import asyncHandler from "../../utils/asyncHandler.js";
import chatModel from "../../../DB/models/chat.model.js";
import userModel from "../../../DB/models/user.model.js";
import { Types } from "mongoose";

export const accessChat = asyncHandler(async (req, res, next) => {
  // data
  const { partnerId } = req.body;
  const userId = req.user._id;

  // check if chat exists
  var partnerObjectId = new Types.ObjectId(partnerId);
  const users = [userId, partnerObjectId];

  const chatExists = await chatModel
    .findOne({
      isGroupChat: false,
      users,
    })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name pic email",
      },
    });

  if (chatExists)
    return res.json({
      success: true,
      results: chatExists,
      message: "Chat found!",
    });

  // crearte chat
  const partner = await userModel.findOne({ _id: partnerId });

  let chat = await chatModel.create({
    chatName: partner.name,
    isGroupChat: false,
    users,
  });

  chat = await chatModel.findOne(chat._id).populate("users", "-password");

  return res.status(201).json({
    success: true,
    results: chat,
    message: "Chat created Successfully!",
  });
});

export const getAllChats = asyncHandler(async (req, res, next) => {
  // data
  const userId = req.user._id;

  // find chats
  // $in >> if users contain this userId
  // $all>> to search multible ids
  const chats = await chatModel
    .find({ users: { $in: [userId] } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name pic email",
      },
    })
    .sort({ updatedAt: -1 }); // latest (descending)

  // send response
  return res.json({ success: true, results: chats });
});

export const createGroup = asyncHandler(async (req, res, next) => {
  // data
  const { chatName, users } = req.body;
  console.log(chatName, users);

  // push creator user
  users.push(req.user._id);

  // create group chat
  let groupChat = await chatModel.create({
    chatName,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  // populate result
  groupChat = await chatModel
    .findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  // send response
  return res.status(201).json({
    success: true,
    results: groupChat,
    message: "Group created successfully!",
  });
});

export const renameGroup = asyncHandler(async (req, res, next) => {
  // data
  const { chatId, chatName } = req.body;

  // if chat exists update it
  const chatExists = await chatModel
    .findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chatExists) return next(new Error("Chat not found!", { cause: 404 }));

  // send response
  return res.json({
    success: true,
    message: "Chat name updated successfully!",
    results: chatExists,
  });
});

export const addToGroup = asyncHandler(async (req, res, next) => {
  // data
  const { chatId, memberId } = req.body;

  // add member if chat exists
  const chatExists = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: { users: memberId },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chatExists) return next(new Error("Chat not found!", { cause: 404 }));

  // send response
  return res.json({
    success: true,
    message: "Member added successfully!",
    results: chatExists,
  });
});

export const removeFromGroup = asyncHandler(async (req, res, next) => {
  // data
  const { chatId, memberId } = req.body;

  // add member if chat exists
  const chatExists = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $pull: { users: memberId },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chatExists) return next(new Error("Chat not found!", { cause: 404 }));

  // send response
  return res.json({
    success: true,
    message: "Member removed successfully!",
    results: chatExists,
  });
});
