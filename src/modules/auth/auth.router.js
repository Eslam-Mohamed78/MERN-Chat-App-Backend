import { Router } from "express";
import * as authController from "./auth.controller.js";
import * as authValidation from "./auth.validation.js";
import { isValid } from "../../middleware/validation.middleware.js";
import isAuthenticated from "../../middleware/authentication.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

// register
router.post(
  "/",
  fileUpload(filterObject.image).single("profilePic"),
  isValid(authValidation.registerSchema),
  authController.registerUser
);

// login
router.post(
  "/login",
  isValid(authValidation.loginSchema),
  authController.loginUser
);

// logOut
router.patch("/logout", isAuthenticated, authController.logoutUser);

export default router;
