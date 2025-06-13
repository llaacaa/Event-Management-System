import { Request, Response } from "express";
import { jsonWebToken } from "../utils/jsonWebToken";
import { Encrypt } from "../utils/bcryptEncription";
import { User, UserStatus, UserType } from "../types/types";
import { addUser, fetchAllUsers, getUserByEmail, updateUserActivityStatus, updateUserInfo } from "../services/users";

export const registerUser = async (req: Request, res: Response) => {
    const { email, name, lastName, password } = req.body;

    if (!email || !password || !name || !lastName) {
        const message = "Please provide all required fields: email, name, lastName, and password.";
        return res.status(400).send({
            message,
        });
    }

    const user = await getUserByEmail(email);

    if (user.length !== 0) {
        return res.status(400).send({
            message: "User already registered",
        });
    }

    const hashedPassword = await Encrypt.cryptPassword(password);

    const newUser: User = {
        email,
        name,
        lastName,
        userType: UserType.EVENT_CREATOR,
        status: UserStatus.ACTIVE,
        password: hashedPassword,
    };
    await addUser(newUser);

    return res.status(201).json({
        message: "User registered successfully!",
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const message = "Please provide all required fields: email and password.";
        return res.status(400).send({
            message,
        });
    }

    const searchUser: User[] = await getUserByEmail(email);

    const isPasswordValid = await Encrypt.comparePassword(
        password,
        searchUser[0]?.password || ""
    );

    if (searchUser.length == 0 || !isPasswordValid) {
        return res.status(400).json({
            message: "Email or password incorrect.",
        });
    }

    const token = jsonWebToken.generateToken(searchUser[0].email);

    res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        domain: "localhost",
    });

    return res.status(201).json({
        message: "User logged in successfully!",
        user: {
            email: searchUser[0].email,
            name: searchUser[0].name,
            lastName: searchUser[0].lastName,
            userType: searchUser[0].userType,
            status: searchUser[0].status,
        },
    });
};

export const getAllUsers = async (req: Request, res: Response) => {
    const users: User[] = await fetchAllUsers();

    res.status(200).json({
        users
    });
};

export const updateUser = async (req: Request, res: Response) => {
    const { email, name, lastName, userType } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required to identify the user"
        });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const updates: Partial<User> = {};
    if (name) updates.name = name;
    if (lastName) updates.lastName = lastName;
    if (userType && Object.values(UserType).includes(userType)) {
        updates.userType = userType;
    }

    await updateUserInfo(email, updates);

    return res.status(200).json({
        message: "User updated successfully"
    });
};

export const updateUserStatus = async (req: Request, res: Response) => {
    const { status, email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required to identify the user"
        });
    }

    if (!status || !Object.values(UserStatus).includes(status)) {
        return res.status(400).json({
            message: "Valid status is required"
        });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    await updateUserActivityStatus(email, status);

    return res.status(200).json({
        message: `User status updated to ${status} successfully`
    });
};