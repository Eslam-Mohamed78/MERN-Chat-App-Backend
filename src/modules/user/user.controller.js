import userModel from "../../../DB/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const allUsers = asyncHandler(async (req, res, next) => {
  // check if searchkey found
  const checkSearch = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
        _id: { $ne: req.user._id },
      }
    : null;

  if (!checkSearch) return res.json({ success: true, results: [] });

  // search
  const users = await userModel.find(checkSearch);

  return res.json({ success: true, results: users });
});
