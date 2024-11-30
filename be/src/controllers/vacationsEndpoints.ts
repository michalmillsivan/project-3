import express from 'express';
import { getConnection } from '../utils/connectionUtils';
import { log } from 'console';
import { authenticateToken, isAdmin } from '../services/usersService';

const vacationsEndpoints = express.Router();


//get all vacations
vacationsEndpoints.get("/", async (req, res) => { //authenticateToken
    try {
        const data = await getVacations();
        res.json({ vacations: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching vacations" })
    }
});

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

//add vacation
vacationsEndpoints.post("/add", isAdmin, async (req, res) => { //authenticateToken
    const { destination, description, start_date, end_date, price, image } = req.body;
    console.log(req.body);

    try {
        const data = await addVacation(destination, description, start_date, end_date, price, image);
        res.json({ vacations: data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding vacation" })
    }

});

async function addVacation(destination: string, description: string, start_date: string, end_date: string, price: string, image: string) {
    const connection = await getConnection();
    const vacations = await connection?.execute(
        "INSERT INTO `michali_travels`.`vacations` (`destination`, `description`, `start_date`, `end_date`, `price`, `image`) VALUES (?, ?, ?, ?, ?, ?);", [destination, description, start_date, end_date, price, image]
    );
    const result = vacations?.[0];
    return result;
}

//edit vacation
vacationsEndpoints.put("/edit/:id", isAdmin, async (req, res) => { //authenticateToken
    console.log("edit vacation");
    
    const { destination, description, start_date, end_date, price, image } = req.body;
    console.log(req.body);
    const id = req.params.id;
    console.log(id);
    
    try {
        const data = await editVacation(id, destination, description, start_date, end_date, price, image);
        console.log("jjjjjjjjjjjj")
        console.log("data", data);
        res.json({ vacations: data })
        console.log(res.json({ vacations: data }));
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Error editing vacation" })
    }
});

async function editVacation(id: string, destination: string, description: string, start_date: string, end_date: string, price: string, image: string) {
    const connection = await getConnection();
    console.log("connection was made");
    
    const vacations = await connection?.execute(
        "UPDATE `michali_travels`.`vacations` SET `destination` = ?, `description` = ?, `start_date` = ?, `end_date` = ?, `price` = ?, `image` = ? WHERE `vacation_id` = ?;", [destination, description, start_date, end_date, price, image, id]
    );
    console.log("vacations", vacations);    
    const result = vacations?.[0];
    console.log("result", result);
    
    return result;
}

//delete vacation
vacationsEndpoints.delete("/delete/:id", async (req, res) => { //authenticateToken, isAdmin
    const id = req.params.id;
    console.log(id);
    
    try {
        await deleteVacation(id);
        res.json({ message: "Vacation deleted successfully" })
    } catch (error) {
        console.error("Error deleting vacation:", error);
        res.status(500).json({ message: "Error deleting vacation" })
    }
});

async function deleteVacation(id: string) {
    const connection = await getConnection();
    await connection?.execute(
        "DELETE FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]
    );
}

export { vacationsEndpoints };
