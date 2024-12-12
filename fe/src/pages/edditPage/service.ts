import axios from "axios";

export async function getVacationById(id: string) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/vacations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function editVacationApi(id: string, vacation: any) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("destination", vacation.destination);
  formData.append("description", vacation.description);
  formData.append("start_date", vacation.start_date.toISOString().split("T")[0]);
  formData.append("end_date", vacation.end_date.toISOString().split("T")[0]);
  formData.append("price", vacation.price.toString());
  if (vacation.image) {
    console.log("Adding image to FormData:", vacation.image);
    formData.append("image", vacation.image);
  }

 await axios.put(`http://localhost:3000/vacations/edit/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
