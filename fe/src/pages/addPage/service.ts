import axios from "axios";
import { format } from "date-fns";

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

        // Format dates for MySQL
        const formattedStartDate = vacation.start_date
            ? format(vacation.start_date, "yyyy-MM-dd")
            : "";
        const formattedEndDate = vacation.end_date
            ? format(vacation.end_date, "yyyy-MM-dd")
            : "";

        formData.append("start_date", formattedStartDate);
        formData.append("end_date", formattedEndDate);
        formData.append("price", vacation.price);
        if (vacation.image) {
            formData.append("image", vacation.image);
        }

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
