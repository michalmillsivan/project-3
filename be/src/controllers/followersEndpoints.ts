import express from 'express';
import { getConnection } from '../utils/connectionUtils';
import e from 'express';

const followersEndpoints = express.Router();

followersEndpoints.get("/", async (req, res) => {
    try {
        const data = await getFollowers();
        res.json({ users: data })
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
    
});

async function getFollowers() {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "SELECT * FROM followers"
    );
    const result = followers?.[0];
    return result;
}

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
})

async function addFollower(user_id: number, vacation_id: number) {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "INSERT INTO `michali_travels`.`followers` (`user_id`, `vacation_id`) VALUES (?, ?);", [user_id, vacation_id]
    );
    const result = followers?.[0];
    return result;
}

async function deleteFollower(user_id: number, vacation_id: number) {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "DELETE FROM `michali_travels`.`followers` WHERE `user_id` = ? AND `vacation_id` = ?;", [user_id, vacation_id]
    );
    const result = followers?.[0];
    return result;
}

async function toggleFollower(user_id: number, vacation_id: number) {
    const connection = await getConnection();

    // Fetch followers for the specific user and vacation
    const [rows]: any = await connection?.execute(
        "SELECT * FROM `michali_travels`.`followers` WHERE `user_id` = ? AND `vacation_id` = ?;",
        [user_id, vacation_id]
    );

    // Check if the user is already following the vacation
    const isFollowing = rows.length > 0;

    if (isFollowing) {
        // User is already following; remove them
        await deleteFollower(user_id, vacation_id);
        return { following: false };
    } else {
        // User is not following; add them
        await addFollower(user_id, vacation_id);
        return { following: true };
    }
}


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



export { followersEndpoints };
