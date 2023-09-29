import joi from "joi";
import { isValidObjectId } from "./../../middleware/validation.middleware.js";

export const accessChatSchema = joi
  .object({
    partnerId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const createGroupSchema = joi
  .object({
    chatName: joi.string().min(3).max(25).required(),
    users: joi
      .array()
      .min(2)
      .items(joi.string().custom(isValidObjectId))
      .required(),
  })
  .required();

export const renameGroupSchema = joi
  .object({
    chatId: joi.string().custom(isValidObjectId).required(),
    chatName: joi.string().min(3).max(25).required(),
  })
  .required();

export const addToGroupSchema = joi
  .object({
    chatId: joi.string().custom(isValidObjectId).required(),
    memberId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const removeFromGroupSchema = joi
  .object({
    chatId: joi.string().custom(isValidObjectId).required(),
    memberId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
