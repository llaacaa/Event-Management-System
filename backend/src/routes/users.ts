import express from "express";
import asyncHandler from "../utils/catchAsync";
import { getAllUsers, loginUser, registerUser, updateUser, updateUserStatus } from "../controllers/users";
import { checkForAdminToken } from "../middlewares/checkForToken";
import { checkBody } from "../middlewares/checkBody";

const usersRouter = express.Router();

// usersRouter.post("/register", asyncHandler(registerUser));
//3.1 prijava
usersRouter.post("/login", checkBody, asyncHandler(loginUser));

usersRouter.get("/", checkForAdminToken, asyncHandler(getAllUsers));
usersRouter.post("/", checkBody, checkForAdminToken, asyncHandler(registerUser));
usersRouter.put("/", checkBody, checkForAdminToken, asyncHandler(updateUser));
usersRouter.patch("/", checkBody, checkForAdminToken, asyncHandler(updateUserStatus));

export default usersRouter;