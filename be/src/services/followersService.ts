import { getConnection } from "../utils/connectionUtils";

export async function getFollowers() {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "SELECT * FROM followers"
    );
    const result = followers?.[0];
    return result;
}

export async function addFollower(user_id: number, vacation_id: number) {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "INSERT INTO `michali_travels`.`followers` (`user_id`, `vacation_id`) VALUES (?, ?);", [user_id, vacation_id]
    );
    const result = followers?.[0];
    return result;
}

export async function deleteFollower(user_id: number, vacation_id: number) {
    const connection = await getConnection();
    const followers = await connection?.execute(
        "DELETE FROM `michali_travels`.`followers` WHERE `user_id` = ? AND `vacation_id` = ?;", [user_id, vacation_id]
    );
    const result = followers?.[0];
    return result;
}

export async function toggleFollower(user_id: number, vacation_id: number) {
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