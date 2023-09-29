import asyncHandler from "../../utils/asyncHandler.js";
import userModel from "./../../../DB/models/user.model.js";
import tokenModel from "./../../../DB/models/token.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../utils/cloud.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  // data
  const { name, email, password } = req.body;

  // check user existence
  const userExists = await userModel.findOne({ email });
  if (userExists)
    return next(new Error("User already exists!", { cause: 409 }));

  // create user
  const user = await userModel.create({
    name,
    email,
    password,
  });

  // upload picture to cloud
  console.log("req.file", req.file);
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}`,
      }
    );

    // upload picture to DB
    user.pic = { id: public_id, url: secure_url };
    await user.save();
  }

  // send response
  return user
    ? res.status(201).send({
        success: true,
        message: "User created successfully",
        results: user,
      })
    : next(new Error("Failed to create user", { cause: 400 }));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  // data
  const { email, password } = req.body;

  // check user existence
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  // check password correctness
  const match = bcrypt.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid login data", { cause: 400 }));

  // generate token
  const token = jwt.sign(
    { name: user.name, email: user.email, id: user._id, pic: user.pic.url },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: "2d" }
  );

  // save token in DB
  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  // send response
  return res.json({ success: true, results: token });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  // data
  let { token } = req.headers;

  // split token
  token = token.split(process.env.BEARER_KEY);

  // make token unValid
  token = await tokenModel.findOneAndUpdate(
    { token },
    {
      isValid: false,
    }
  );

  // send response
  return token
    ? res.json({ success: true, message: "Signed out successfully!" })
    : next(new Error("Sign out failed!"));
});
