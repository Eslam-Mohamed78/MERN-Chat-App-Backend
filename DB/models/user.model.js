import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    pic: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dayeympjm/image/upload/v1695221506/mern-chat-app/kv8maxp3jzvd70ix8ry0.jpg",
      },
      id: {
        type: String,
        default: "mern-chat-app/defaultProfilePicture",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"], 
    },
  },
  { timestamps: true, strictQuery: true }
);

/********* Pre Hook (mongoose middleware) *********/
// hash password
userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(
      this.password,
      Number(process.env.SALT_ROUND)
    );
  }
});

const userModel = model("User", userSchema);

export default userModel;
