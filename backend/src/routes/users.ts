import express from "express";
import asyncHandler from "../utils/catchAsync";
import { getAllUsers, loginUser, registerUser, updateUser, updateUserStatus } from "../controllers/users";
import { checkForAdminToken } from "../utils/jsonWebToken";

const usersRouter = express.Router();

// usersRouter.post("/register", asyncHandler(registerUser));
//3.1 prijava
usersRouter.post("/login", asyncHandler(loginUser));

usersRouter.get("/", checkForAdminToken, asyncHandler(getAllUsers));
usersRouter.post("/", checkForAdminToken, asyncHandler(registerUser));
usersRouter.put("/", checkForAdminToken, asyncHandler(updateUser));
usersRouter.patch("/", checkForAdminToken, asyncHandler(updateUserStatus));

export default usersRouter;