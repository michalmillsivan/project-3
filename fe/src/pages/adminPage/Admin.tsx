import { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { getVacationsApi, deleteVacationApi } from "./service";
import MenuAppBar from "../../components/app-bar/app-bar";
import AdminVacationCard from "../../components/cards/adminCards";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"


const AdminPage = () => {
    console.log("Admin page started");
    const navigate = useNavigate();
    
    const [vacations, setVacations] = useState<any[]>([]);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vacationToDelete, setVacationToDelete] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 10;

    useEffect(() => {

        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }
                const decoded = jwtDecode<{ role?: string }>(token);
                console.log("decoded.role:", decoded.role);

                if (decoded.role === "admin") {
                    setIsUserAdmin(true);
                    fetchVacations();
                } else {
                    setIsUserAdmin(false);
                    window.location.href = "/vacations";
                }
            } catch (error) {
                console.log("Failed to check admin status:", error);
                alert("Error checking admin status. Please try again later.");
                window.location.href = "/vacations";
            }
        }
        checkAdminStatus();
    }, []);

    const fetchVacations = async () => {
        try {
            setIsLoading(true);
            const result = await getVacationsApi();
            setVacations(result);
        } catch (error) {
            console.error("Failed to fetch vacations:", error);
            alert("Failed to fetch vacations.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (vacationToDelete === null) return;
        console.log("Deleting vacation:", vacationToDelete);
        try {
            console.log("Deleting vacation...");
            
            await deleteVacationApi(vacationToDelete);
            setVacations((prev) => prev.filter((v) => v.vacation_id !== vacationToDelete));
            alert("Vacation deleted successfully.");
        } catch (error) {
            console.error("Failed to delete vacation:", error);
            alert("Failed to delete vacation.");
        } finally {
            setDeleteDialogOpen(false);
            setVacationToDelete(null);
        }
    };

    const totalPages = Math.ceil(vacations.length / itemsPerPage);
    const indexOfLastVacation = currentPage * itemsPerPage;
    const indexOfFirstVacation = indexOfLastVacation - itemsPerPage;
    const currentVacations = vacations.slice(indexOfFirstVacation, indexOfLastVacation);

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

    
    if (isUserAdmin === null) {
        return <Typography variant="h5">Checking admin status...</Typography>;
    }

    if (!isUserAdmin) {
        return (<div>
            <h1>Access Denied</h1>
        </div>)
    }

    return (
        <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
            <MenuAppBar />
            <Box
                sx={{
                    width: "100%",
                    padding: { xs: "0 8px", sm: "0 16px", md: "0 32px" },
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Panel
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: "16px" }}
                    onClick={() => navigate("/add-vacation")}
                >
                    Add Vacation
                </Button>
            
                <Grid container spacing={4} sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}>
                    {isLoading ? (
                        <Typography variant="h5" align="center">
                            Loading...
                        </Typography>
                    ) : (
                        currentVacations.map((vacation: any) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={vacation.vacation_id}>
                                <AdminVacationCard
                                    vacation={vacation}
                                    isAdmin={true}
                                    onEdit={() => navigate("/edit-vacation/" + vacation.vacation_id)}
                                    onDelete={() => {
                                        setVacationToDelete(vacation.vacation_id);
                                        setDeleteDialogOpen(true);
                                    }}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
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

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this vacation? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminPage;
