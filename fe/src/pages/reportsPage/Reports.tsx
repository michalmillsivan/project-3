import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ResponsiveAppBar from "../../components/app-bar/app-bar"; // Ensure this path is correct

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ReportsPage = () => {
    const [reportData, setReportData] = useState<Array<{ destination: string; follower_count: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await axios.get<{ report: { destination: string; follower_count: number }[] }>(
                    "http://localhost:3000/followers/report",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReportData(response.data.report);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
                alert("Error fetching report data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, []);

    // Prepare data for Chart.js
    const chartData = {
        labels: reportData.map((item) => item.destination),
        datasets: [
            {
                label: "Number of Followers",
                data: reportData.map((item) => item.follower_count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Function to download CSV
    const downloadCSV = () => {
        const csvRows = [
            ["Destination", "Followers"], // Header row
            ...reportData.map((item) => [item.destination, item.follower_count]), // Data rows
        ];

        const csvContent = csvRows.map((row) => row.join(",")).join("\n"); // Convert to CSV format
        const blob = new Blob([csvContent], { type: "text/csv" }); // Create a Blob
        const url = URL.createObjectURL(blob); // Generate a download link

        // Create a temporary anchor element and trigger a download
        const a = document.createElement("a");
        a.href = url;
        a.download = "Vacation_Followers.csv";
        a.click();
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    return (
        <div>
            {/* AppBar */}
            <ResponsiveAppBar />
            <Box sx={{ padding: "16px", marginTop: "64px", width: "100%", overflowX: "hidden" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Admin Reports: Vacation Followers
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: "16px" }}
                    onClick={downloadCSV}
                >
                    Download CSV
                </Button>
                {isLoading ? (
                    <Typography variant="h6">Loading...</Typography>
                ) : (
                    <Box
                        sx={{
                            width: "100%", // Full container width
                            overflowX: "auto", // Enable horizontal scrolling
                            overflowY: "hidden", // Disable vertical scrolling
                            paddingBottom: "16px", // Add padding for better UX
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: `${reportData.length * 100}px`, // Dynamic width based on number of vacations
                                height: "500px", // Fixed height for the chart
                            }}
                        >
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                    },
                                    maintainAspectRatio: false, // Allow custom height
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default ReportsPage;
