import chatModel from "../../../DB/models/chat.model.js";
import messageModel from "../../../DB/models/message.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  // data
  const { chatId, content } = req.body;
  const sender = req.user._id;

  // create message
  let message = await messageModel.create({
    sender,
    content,
    chatId,
  });

  // populate result
  message = await messageModel
    .findOne(message._id)
    .populate({ path: "sender", select: "name email pic" })
    .populate({
      path: "chatId",
      populate: { path: "users", select: "name email pic" },
    });

  // save message as latest in chat model
  await chatModel.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  // send response
  res.json({
    success: true,
    message: "Message sent successfully!",
    results: message,
  });
});

export const allMessages = asyncHandler(async (req, res, next) => {
  // data
  const { chatId } = req.params; 

  // find messages
  const messages = await messageModel
    .find({chatId})
    .populate({ path: "sender", select: "name email pic" })
    .populate({
      path: "chatId",
      populate: { path: "users", select: "name email pic" },
    });

  // send response
  res.json({ success: true, results: messages });
});
