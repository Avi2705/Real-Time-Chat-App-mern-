import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  signup,
  login,
  updateProfile,
  checkauth,
} from "../Controlller/Usercontrol.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkauth);

export default userRouter;
