import express from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/change-password").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/current-user").get(authenticateUser, getCurrentUser);

export default router;
