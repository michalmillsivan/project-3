import express from 'express';
import { getConnection } from '../utils/connectionUtils';
import { any, z } from 'zod';
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { RowDataPacket, OkPacket } from "mysql2/promise"
import dotenv from 'dotenv';

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
        console.log(" trying to register");

        const userData = extractBody(req.body);
        console.log("extracted data");


        console.log(userData);
        registerSchema.parse(userData);
        console.log("parsed data");
        const data = await register(userData.first_name, userData.last_name, userData.email, userData.password, res); //jjjjj
        if (data === null) {
            return res.status(401).send("Invalid credentials");
        } else {
            const token = jwt.sign({ email: data }, "secret_app", { expiresIn: "1h" }); //process.env.SECRET as string

            res.json({token, message:"Registration successful"});
        }
    } catch (error : any) {
        console.error(error);

        if (error instanceof z.ZodError) {
            res.status(400).json(error.issues); // Send validation errors
        } else if (error.message === "Email already exists") {
            res.status(409).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Something went wrong" });
        }

    }
})



async function register(first_name: string, last_name: string, email: string, password: string, res: Response) { ////jjjjj
    const connection = await getConnection();
    if (!connection) {
        throw new Error("Failed to establish a database connection");
    }
    try {
        const result = await connection.execute<OkPacket>(
            "INSERT INTO `michali_travels`.`users` (`first_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?);",
            [first_name, last_name, email, password]
        );

        if (!result) {
            throw new Error("Query execution failed");
        }

        const [rows] = result;

        return rows;
    } catch (error : any) {
        console.error("Error occurred:", error);

    // Handle specific error cases
    if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "Email already exists" });
    } else {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
    }

  
}

//login
const loginSchema = z.object({
    email: z.string().min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string().min(4, { message: "Password has to be at least 4 characters." }),
});

usersEndpoints.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        console.log("Validated input:", { email, password });
        
        const data = await loginUser(email, password);
        if (!data) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Generate JWT token if user exists
        console.log("User found, generating token...");
        const token = jwt.sign({ email: data.email, role: data.role, first_name: data.first_name, user_id: data.user_id }, "secret_app", { expiresIn: "10h" }); //process.env.SECRET as string
        res.json({ token, user: { email: data.email, role: data.role, first_name: data.first_name, user_id: data.user_id } });
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json(error.issues); // Return validation errors
        } else {
            console.error("Error:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

})

async function loginUser(email: string, password: string) {
    const connection = await getConnection();
    const result = await connection?.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password]
    );
    if (!result) {
        return null;
    }
    const [rows] = result;
    if (!rows || rows.length === 0) {
        return null;
    }
    return rows[0];
}







export { usersEndpoints };