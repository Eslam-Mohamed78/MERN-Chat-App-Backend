import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const sendMessageSchema = joi
  .object({
    chatId: joi.string().custom(isValidObjectId).required(),
    content: joi.string().required(),
  })
  .required();

export const allMessagesSchema = joi
  .object({
    chatId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
