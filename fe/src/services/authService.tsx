import axios from "axios";

const token = localStorage.getItem("token");

export default async function isAdmin(): Promise<boolean> {
    try {
      const result = await axios.get("http://localhost:3000/authentication/isAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data.message === "User is admin";
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.warn("Access denied: User is not admin.");
      } else {
        console.error("Error checking admin status:", error);
      }
      return false;
    }
  }
