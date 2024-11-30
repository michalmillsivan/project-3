import axios from "axios";

const vacationsURL = "http://localhost:3000/vacations";
const followersURL = "http://localhost:3000/followers";

export type VacationApi = typeof template;

const template = {
    "vacation_id": 13,
    "destination": "Hawaii",
    "description": "A tropical paradise with beautiful beaches and waterfalls.",
    "start_date": "2024-11-30T22:00:00.000Z",
    "end_date": "2024-12-09T22:00:00.000Z",
    "price": "1500.00",
    "image": "hawaii.png"
};

export type VacationUI = {
    vacation_id: number;
    destination: string;
    description: string;
    start_date: string;
    end_date: string;
    price: string;
    image: string;
};

export async function getVacationsApi(): Promise<Array<VacationUI>> {
    const result = await axios.get<{ vacations: VacationApi[] }>(vacationsURL);
    const data = result?.data?.vacations.map(v => {
        return {
            vacation_id: v.vacation_id,
            destination: v.destination,
            description: v.description,
            start_date: v.start_date,
            end_date: v.end_date,
            price: v.price,
            image: v.image
        };
    });
    return data;
}

export type FollowersApi = typeof followersTemplate;

const followersTemplate = {
    "user_id": 1,
    "vacation_id": 1
};

export type FollowersUI = {
    user_id: number;
    vacation_id: number;
};

export async function getFollowersApi(): Promise<Array<FollowersUI>> {
    try {
        const result = await axios.get<{ users?: FollowersApi[] }>(followersURL);
        console.log("API Response:", result.data);
        const data =
            result?.data?.users?.map(f => ({
                user_id: f.user_id,
                vacation_id: f.vacation_id
            })) || [];
        return data;
    } catch (error) {
        console.error("Error fetching followers:", error);
        return [];
    }
}

// Add toggleFollowerApi function
export async function toggleFollowerApi(user_id: number, vacation_id: number) {
    try {
        const response = await axios.post<{ following: boolean }>(`${followersURL}/toggle`, {
            user_id,
            vacation_id
        });

        console.log("Toggle Follower API Response:", response.data);
        return response.data; // { following: true/false }
    } catch (error) {
        console.error("Error toggling follower:", error);
        throw error;
    }
}
