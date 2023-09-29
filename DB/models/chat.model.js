import { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
  {
    chatName: { type: String, min: 3, max: 25, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: {
      type: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [arrayLimit, "At least add 2 members"],
    },
    latestMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// check users array length
function arrayLimit(val) {
  return val.length >= 2;
}

const chatModel = model("Chat", chatSchema);

export default chatModel;
