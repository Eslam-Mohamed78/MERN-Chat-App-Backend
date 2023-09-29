import { Router } from "express";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";

const router = Router();

// all-users
router.get("/", isAuthenticated, userController.allUsers);

export default router;
