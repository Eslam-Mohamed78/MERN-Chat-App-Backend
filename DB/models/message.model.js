import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chatId: { type: Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const messageModel = model("Message", messageSchema);

export default messageModel;
