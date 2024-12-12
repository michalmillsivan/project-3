import { getConnection } from "../utils/connectionUtils";
import path from "path";
import fs from "fs/promises";
import { RowDataPacket } from "mysql2/promise";


export async function getVacations() {
    const connection = await getConnection()

    if (!connection) {
        throw new Error("Unable to establish database connection");
    }

    const vacations = await connection?.execute(
        "SELECT * FROM vacations ORDER BY start_date ASC"
    );
    const result = vacations?.[0];
    return result;
}

export async function addVacation(destination: string, description: string, start_date: string, end_date: string, price: string, image: string) {
    const connection = await getConnection();
    const vacations = await connection?.execute(
        "INSERT INTO `michali_travels`.`vacations` (`destination`, `description`, `start_date`, `end_date`, `price`, `image`) VALUES (?, ?, ?, ?, ?, ?);", [destination, description, start_date, end_date, price, image]
    );
    const result = vacations?.[0];
    return result;
}

export async function editVacation(id: string, destination: string, description: string, start_date: string, end_date: string, price: string, image: string) {
    const connection = await getConnection();
    console.log("connection was made in editVacation");

    const vacations = await connection?.execute(
        "UPDATE `michali_travels`.`vacations` SET `destination` = ?, `description` = ?, `start_date` = ?, `end_date` = ?, `price` = ?, `image` = ? WHERE `vacation_id` = ?;", [destination, description, start_date, end_date, price, image, id]
    );
    console.log("vacations in editVacation", vacations);
    const result = vacations?.[0];
    console.log("result of editVacationnnnn", result);

    return result;
    
}

export async function deleteVacation(id: string) {
    const connection = await getConnection();
    if (!connection) {
        throw new Error("Unable to establish database connection");
    }
    try {
        const [rows]: [RowDataPacket[], any] = await connection.execute(
            "SELECT image FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", 
            [id]
        );

        const imageFilename = rows?.[0]?.image;

        if (imageFilename) {
            
            const imagePath = path.join(__dirname, "../uploads", imageFilename);

            
            try {
                await fs.unlink(imagePath);
                // console.log(`Deleted image file: ${imagePath}`);
            } catch (error) {
                console.error(`Failed to delete image file: ${imagePath}`, error);
            }
        }
        await connection?.execute(
            "DELETE FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]
        );
        // console.log(`Vacation with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting vacation:", error);
        throw error;
    }
    
}

export async function getVacationById(id: string) {
    const connection = await getConnection();
    if (!connection) {
        throw new Error("Unable to establish database connection");
    }
 try {
    const [rows]: [RowDataPacket[], any] = await connection.execute(
        "SELECT * FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]
    );
    const result = rows?.[0];
    return result;
 } catch (error) {
    console.error("Error fetching vacation by ID:", error);
    throw error;
 }
}
