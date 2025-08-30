import { Request, Response } from "express";
import { jsonWebToken } from "../utils/jsonWebToken";
import { Encrypt } from "../utils/bcryptEncription";
import { User, UserStatus, UserType } from "../types/types";
import {
  addUser,
  fetchAllUsers,
  getUserByEmail,
  updateUserActivityStatus,
  updateUserInfo,
} from "../services/users";
import { isValidEmail } from "../utils/format";

export const registerUser = async (req: Request, res: Response) => {
  const { email, name, lastName, password } = req.body;

  if (!email || !password || !name || !lastName) {
    const message =
      "Please provide all required fields: email, name, lastName, and password.";
    return res.status(400).json({
      success: false,
      error: {
        message,
      },
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid email format.",
      },
    });
  }

  const userFromDB = await getUserByEmail(email);

  if (!userFromDB.success) {
    return res
      .status(userFromDB.status || 500)
      .json({ success: false, error: userFromDB.error });
  }

  const user: User[] = userFromDB.data;

  if (user.length !== 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: "User already registered",
      },
    });
  }

  const hashedPassword = await Encrypt.cryptPassword(password);

  const newUser: User = {
    email,
    name,
    lastName,
    userType: UserType.EVENT_CREATOR,
    status: UserStatus.ACTIVE, // Assuming new users are active by default
    password: hashedPassword,
  };
  await addUser(newUser);

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const message = "Please provide all required fields: email and password.";
    return res.status(400).json({
      success: false,
      error: {
        message,
      },
    });
  }

  const searchUserFromDB = await getUserByEmail(email);

  if (!searchUserFromDB.success) {
    return res
      .status(searchUserFromDB.status || 500)
      .json({ success: false, error: searchUserFromDB.error });
  }

  const searchUser: User[] = searchUserFromDB.data;

  const isPasswordValid = await Encrypt.comparePassword(
    password,
    searchUser[0]?.password || ""
  );

  if (searchUser.length == 0 || !isPasswordValid) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email or password incorrect.",
      },
    });
  }

  if (searchUser[0].status === UserStatus.NOT_ACTIVE) {
    return res.status(403).json({
      success: false,
      error: {
        message: "User is not active.",
      },
    });
  }

  const token = jsonWebToken.generateToken(searchUser[0].email);

  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    domain: "localhost",
  });

  return res.status(201).json({
    success: true,
    message: "User logged in successfully!",
    data: {
      user: {
        email: searchUser[0].email,
        name: searchUser[0].name,
        lastName: searchUser[0].lastName,
        userType: searchUser[0].userType,
        status: searchUser[0].status,
      },
    },
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const usersFromDB = await fetchAllUsers();

  if (!usersFromDB.success) {
    return res
      .status(usersFromDB.status || 500)
      .json({ success: false, error: usersFromDB.error });
  }

  const users: User[] = usersFromDB.data;

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, name, lastName, userType } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email is required to identify the user",
      },
    });
  }

  const existingUserFromDB = await getUserByEmail(email);

  if (!existingUserFromDB.success) {
    return res
      .status(existingUserFromDB.status || 500)
      .json({ success: false, error: existingUserFromDB.error });
  }

  const existingUser: User[] = existingUserFromDB.data;

  if (existingUser.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: "User not found",
      },
    });
  }

  const updates: Partial<User> = {};
  if (name) updates.name = name;
  if (lastName) updates.lastName = lastName;
  if (userType && Object.values(UserType).includes(userType)) {
    updates.userType = userType;
  }

  const updateResponseFromDB = await updateUserInfo(email, updates);

  if (!updateResponseFromDB) {
    return res.status(400).json({
      success: false,
      error: {
        message: "No updates provided or invalid user type",
      },
    });
  }

  if (!updateResponseFromDB.success) {
    return res.status(updateResponseFromDB.status || 500).json({
      success: false,
      error: updateResponseFromDB.error,
    });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { status, email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email is required to identify the user",
      },
    });
  }

  if (!status || !Object.values(UserStatus).includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Valid status is required",
      },
    });
  }

  const existingUserFromDB = await getUserByEmail(email);

  if (!existingUserFromDB.success) {
    return res
      .status(existingUserFromDB.status || 500)
      .json({ success: false, error: existingUserFromDB.error });
  }

  const existingUser: User[] = existingUserFromDB.data;

  if (existingUser.length === 0) {
    return res.status(404).json({
      success: false,
      error: {
        message: "User not found",
      },
    });
  }

  await updateUserActivityStatus(email, status);

  return res.status(200).json({
    success: true,
    message: `User status updated to ${status} successfully`,
  });
};
