import { Request, Response, NextFunction } from "express";
import { RowDataPacket, OkPacket } from "mysql2/promise"
import { getConnection } from "../utils/connectionUtils";

export async function register(first_name: string, last_name: string, email: string, password: string, res: Response) { 
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

export async function loginUser(email: string, password: string) {
    const connection = await getConnection();
    console.log("connection", connection);
    const result = await connection?.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password]
    );
    console.log("DB Query Result:", result);
    // console.log("result", result);
    
    if (!result) {
        return null;
    }

    const [rows] = result;
    console.log("rows", rows[0]);
    
    if (!rows || rows.length === 0) {
        return null;
    }
    return rows[0];
}
