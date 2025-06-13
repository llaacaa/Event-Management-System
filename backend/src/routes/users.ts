import express from "express";
import asyncHandler from "../utils/catchAsync";
import { getAllUsers, loginUser, registerUser, updateUser, updateUserStatus } from "../controllers/users";

const usersRouter = express.Router();

// usersRouter.post("/register", asyncHandler(registerUser));
//3.1 prijava
usersRouter.post("/login", asyncHandler(loginUser));

usersRouter.get("/", asyncHandler(getAllUsers));
usersRouter.post("/", asyncHandler(registerUser));
usersRouter.put("/", asyncHandler(updateUser));
usersRouter.patch("/", asyncHandler(updateUserStatus));

export default usersRouter;