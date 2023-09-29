import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as messageController from "./message.controller.js";
import * as messageValidation from "./message.validation.js";

const router = Router();

// send message
router.post(
  "/",
  isAuthenticated,
  isValid(messageValidation.sendMessageSchema),
  messageController.sendMessage
);

// get all messages
router.get(
  "/:chatId",
  isAuthenticated,
  isValid(messageValidation.allMessagesSchema),
  messageController.allMessages
);

export default router;
