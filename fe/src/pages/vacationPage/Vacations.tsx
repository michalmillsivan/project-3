import { useEffect, useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import { getFollowersApi, getVacationsApi, toggleFollowerApi } from "./service";
import MenuAppBar from "../../components/app-bar/app-bar";
import VacationCard from "../../components/cards/card";
import FilterCheckboxes from "../../components/filter-check-boxes/filter";

const VacationsPage = () => {
    const [vacations, setVacations] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [isLoadingVacations, setIsLoadingVacations] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<"following" | "notStarted" | "occurring" | null>(null);
    const itemsPerPage = 10;

    const user = localStorage.getItem("user");
    const user_id = user ? JSON.parse(user).user_id : null;

    useEffect(() => {
        console.log("Vacations page started");
        
        async function getVacationsData() {
            try {
                console.log("Fetching vacations...");
                
                setIsLoadingVacations(true);
                const result = await getVacationsApi();
                console.log("Vacations data:", result);
                
                const followersResult = await getFollowersApi();
                console.log("Followers data:", followersResult);
                setVacations(result);
                setFollowers(followersResult);
            } catch (error) {
                console.error("Failed to fetch vacations:", error);
                alert("Failed to fetch vacations");
            } finally {
                setIsLoadingVacations(false);
            }
        }
        getVacationsData();
    }, []);

    const handleFollow = async (vacation_id: number) => {
        try {
            const { following } = await toggleFollowerApi(user_id, vacation_id);

            setFollowers((prevFollowers) => {
                if (following) {
                    return [...prevFollowers, { user_id, vacation_id }];
                } else {
                    return prevFollowers.filter(
                        (f) =>
                            !(f.user_id === user_id && f.vacation_id === vacation_id)
                    );
                }
            });
        } catch (error) {
            alert("Failed to update follow status");
        }
    };

    const applyFilters = () => {
        let filteredVacations = [...vacations];

        if (activeFilter === "following") {
            filteredVacations = filteredVacations.filter((vacation) =>
                followers.some(
                    (f) => f.user_id === user_id && f.vacation_id === vacation.vacation_id
                )
            );
        }

        if (activeFilter === "notStarted") {
            filteredVacations = filteredVacations.filter(
                (vacation) => new Date(vacation.start_date) > new Date()
            );
        }

        if (activeFilter === "occurring") {
            const now = new Date();
            filteredVacations = filteredVacations.filter(
                (vacation) =>
                    new Date(vacation.start_date) <= now &&
                    new Date(vacation.end_date) >= now
            );
        }

        return filteredVacations;
    };

    // Pagination logic
    const filteredVacations = applyFilters();
    const totalPages = Math.ceil(filteredVacations.length / itemsPerPage);
    const indexOfLastVacation = currentPage * itemsPerPage;
    const indexOfFirstVacation = indexOfLastVacation - itemsPerPage;
    const currentVacations = filteredVacations.slice(indexOfFirstVacation, indexOfLastVacation);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden", marginTop: "70px" }}>
            <MenuAppBar />
            <Box
                sx={{
                    width: "100%",
                    padding: { xs: "0 8px", sm: "0 16px", md: "0 32px" }, // Padding for different breakpoints
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Vacations Page
                </Typography>

                {/* Use FilterCheckboxes Component */}
                <FilterCheckboxes
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <Grid container spacing={4} justifyContent="center">
                    {isLoadingVacations ? (
                        <Typography variant="h5" align="center">
                            Loading...
                        </Typography>
                    ) : currentVacations.map((vacation: any) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={vacation.vacation_id}>
                            <VacationCard
                                vacation={vacation}
                                followers={followers}
                                user_id={user_id}
                                handleFollow={handleFollow}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination Controls */}
                <Box
                    sx={{
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        width: "100%",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Typography variant="body1">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default VacationsPage;
