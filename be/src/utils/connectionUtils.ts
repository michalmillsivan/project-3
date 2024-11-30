import mysql2 from "mysql2/promise"
import dotenv from "dotenv";
dotenv.config()

let connection: mysql2.Connection | null = null;
export async function getConnection() {
    if (connection !== null) return connection;
    try {
        console.log("create connection")
        connection = await mysql2.createConnection({
            host: "localhost",
            user:"root",
            password: "password",
            database: "michali_travels",
            port: 3306,
        });
        return connection
    } catch (error) {
        console.log(error)
    }
}
