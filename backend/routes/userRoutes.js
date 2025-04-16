import express from "express";
import {
  fetchUserData,
  editUserData,
  deleteAccount,
  changePassword,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

// Fetch user data
userRouter.get("/profile", auth, fetchUserData);

// Edit user data
userRouter.put("/profile", auth, editUserData);

// Delete account
userRouter.delete("/account", auth, deleteAccount);

// Change password
userRouter.post("/change-password", auth, changePassword);

export default userRouter;