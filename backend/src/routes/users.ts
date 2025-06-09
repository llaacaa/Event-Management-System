import express from "express";
import asyncHandler from "../utils/catchAsync";
import { loginUser, registerUser } from "../controllers/users";

const usersRouter = express.Router();

usersRouter.post("/register", asyncHandler(registerUser));

usersRouter.post("/login", asyncHandler(loginUser));

export default usersRouter;