import express from 'express';
import { getConnection } from '../utils/connectionUtils';
import { addFollower, deleteFollower, getFollowers, toggleFollower } from '../services/followersService';

const followersEndpoints = express.Router();

followersEndpoints.get("/", async (req, res) => {
    try {
        const data = await getFollowers();
        res.json({ users: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
    
});

followersEndpoints.post("/", async (req, res) => {
    const { user_id, vacation_id } = req.body;
    try {
        const data = await addFollower(user_id, vacation_id);
        res.json({ users: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
    // res.json({ message: "Hello from users" });

});

followersEndpoints.delete("/", async (req, res) => {
    const { user_id, vacation_id } = req.body;
    try {
        const data = await deleteFollower(user_id, vacation_id);
        res.json({ users: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
    res.json({
        // message: "Hello from users"
    });
});

followersEndpoints.post("/toggle", async (req, res) => {
    const { user_id, vacation_id } = req.body;
    
    try {
        const data = await toggleFollower(user_id, vacation_id);
        res.json(data);
    } catch (error) {
        console.log(error);        
        res.status(500).json({ message: "Error toggling follower" });
    }
});

followersEndpoints.get("/report", async (req, res) => {
    try {
        const data = await getFollowersReport();
        res.json({ report: data });
    } catch (error) {
        console.error("Error fetching followers report:", error);
        res.status(500).json({ message: "Error fetching followers report" });
    }
});

export async function getFollowersReport() {
    const connection = await getConnection();
    const [rows]: any = await connection?.execute(
        `
        SELECT v.destination, COUNT(f.user_id) AS follower_count
        FROM vacations v
        LEFT JOIN followers f ON v.vacation_id = f.vacation_id
        GROUP BY v.vacation_id, v.destination
        ORDER BY follower_count DESC
        `
    );
    return rows;
}


export { followersEndpoints };
