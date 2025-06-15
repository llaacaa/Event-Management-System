import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRouter from "./routes/users";
import categoriesRouter from "./routes/categories";
import eventsRouter from "./routes/events";
import cookieParser from 'cookie-parser';
import { initAdmin } from "./utils/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

(async () => {
    try {
        await initAdmin();
        console.log("Admin initialization completed");
    } catch (error) {
        console.error("Failed to initialize admin:", error);
    }
})();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);
app.use("/events", eventsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
