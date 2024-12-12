import axios from "axios";
const vacationsURL = "http://localhost:3000/vacations";

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
    console.log("Fetching vacations...");
    
    const token = localStorage.getItem("token");
    console.log("get vacation Token:", token);
    
    if (!token) {
        console.error("No token found. User might not be logged in.");
        throw new Error("Unauthorized. Token is missing.");
    }

    try {
        console.log("starting axios get");
        
        const result = await axios.get<{ vacations: VacationApi[] }>(vacationsURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Backend response:", result.data);

        // Map and return the transformed vacations
        return result?.data?.vacations.map(v => ({
            vacation_id: v.vacation_id,
            destination: v.destination,
            description: v.description,
            start_date: v.start_date,
            end_date: v.end_date,
            price: v.price,
            image: v.image,
        }));
    } catch (error) {
        console.log("couldnt try");
        
        console.error("Error fetching vacations:", error);
        throw error;
    }
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





export async function deleteVacationApi(vacationId: number): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User might not be logged in.");
        throw new Error("Unauthorized. Token is missing.");
    }

    try {
        await axios.delete(`http://localhost:3000/vacations/delete/${vacationId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); 
        console.log(`Vacation ${vacationId} deleted successfully.`); 
    } catch (error) {
        console.error("Error deleting vacation:", error);
        throw error;
    }
}

export async function addVacationApi(vacation: {
    destination: string;
    description: string;
    start_date: Date | null;
    end_date: Date | null;
    price: string;
    image: File | null;
}): Promise<any> {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User might not be logged in.");
        throw new Error("Unauthorized. Token is missing.");
    }

    try {
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("start_date", vacation.start_date?.toISOString() || "");
        formData.append("end_date", vacation.end_date?.toISOString() || "");
        formData.append("price", vacation.price);
        formData.append("image", vacation.image || "");

        const response = await axios.post("http://localhost:3000/vacations/add", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Vacation added successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding vacation:", error);
        throw error;
    }
}

