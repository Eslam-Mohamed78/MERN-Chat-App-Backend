import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as chatController from "./chat.controller.js";
import * as chatValidation from "./chat.validation.js";

const router = Router();

// create || access chat
router.post(
  "/",
  isAuthenticated,
  isValid(chatValidation.accessChatSchema),
  chatController.accessChat
);

// get all-chats
router.get("/", isAuthenticated, chatController.getAllChats);

// create group chat
router.post(
  "/group",
  isAuthenticated,
  isValid(chatValidation.createGroupSchema),
  chatController.createGroup
);

// rename group chat
router.patch(
  "/rename",
  isAuthenticated,
  isValid(chatValidation.renameGroupSchema),
  chatController.renameGroup
);

// addTo group chat
router.patch(
  "/addToGroup",
  isAuthenticated,
  isValid(chatValidation.addToGroupSchema),
  chatController.addToGroup
);

// remove group chat
router.patch(
  "/removeFromGroup",
  isAuthenticated,
  isValid(chatValidation.removeFromGroupSchema),
  chatController.removeFromGroup
);

export default router;
