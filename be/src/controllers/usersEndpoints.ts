import express from 'express';
import { getConnection } from '../utils/connectionUtils';
import { any, z } from 'zod';
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { RowDataPacket, OkPacket } from "mysql2/promise"
import dotenv from 'dotenv';
import { loginUser, register } from '../services/usersService';

dotenv.config();
const usersEndpoints = express.Router();

function extractBody(body: any) {
    const { email, first_name, last_name, password } = body;
    return { email, first_name, last_name, password };
}

//get all users
usersEndpoints.get("/", async (req, res) => {
    try {
        const data = await getUsers();
        res.json({ users: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
});

async function getUsers() {
    const connection = await getConnection();
    const users = await connection?.execute(
        "SELECT * FROM users"
    );
    const result = users?.[0];
    return result;
}


//register

const registerSchema = z.object({
    email: z.string().min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    first_name: z.string().min(1, { message: "First name is required." }),
    last_name: z.string().min(1, { message: "Last name is required." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters long." })
});

//@ts-ignore
usersEndpoints.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = extractBody(req.body);
        registerSchema.parse(userData);
        const data = await register(userData.first_name, userData.last_name, userData.email, userData.password, res);
        if (data === null) {
            return res.status(401).send("Invalid credentials");
        } else {
            res.json({ message: "Registration successful" });
        }
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(error.issues); 
        } else if (error.message === "Email already exists") {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Something went wrong" });
        }

    }
});

//login
const loginSchema = z.object({
    email: z.string().min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string().min(4, { message: "Password has to be at least 4 characters." }),
});

usersEndpoints.post("/login", async (req, res) => {
    try {
        console.log("Trying to login...");
        const { email, password } = loginSchema.parse(req.body);
        // console.log("Validated input:", { email, password });
        // console.log("Login Request Body:", req.body);
        const data = await loginUser(email, password);
        if (!data) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        // console.log("Parsed Input:", { email, password });
        // console.log("User found, generating token...");
        const token = jwt.sign({ email: data.email, role: data.role, first_name: data.first_name, user_id: data.user_id }, process.env.SECRET as string, { expiresIn: "10h" }); 
        res.json({ token, user: { email: data.email, first_name: data.first_name, user_id: data.user_id } });
        // console.log("Token generated", token);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json(error.issues); 
        } else {
            console.error("Error:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
});

export { usersEndpoints };