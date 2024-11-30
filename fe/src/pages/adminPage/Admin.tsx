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
import { getVacationsApi, deleteVacationApi, addVacationApi } from "./service";
import MenuAppBar from "../../components/app-bar/app-bar";
import AdminVacationCard from "../../components/cards/adminCards";
import AddVacationModal from "../../components/addVModal/addVM";

const AdminPage = () => {
    const [vacations, setVacations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vacationToDelete, setVacationToDelete] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const user = localStorage.getItem("user");
    const userRole = user ? JSON.parse(user).role : null;

    useEffect(() => {
        if (userRole !== "admin") {
            alert("Access denied. Only admins can access this page.");
            window.location.href = "/vacations"; // Redirect non-admins
        } else {
            fetchVacations();
        }
    }, [userRole]);

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

    const handleAddVacation = async (vacation: {
        destination: string;
        description: string;
        start_date: Date | null;
        end_date: Date | null;
        price: string;
        image: File | null;
      }) => {
        console.log("Vacation to Add:", vacation);

        try {
            await addVacationApi(vacation);
            alert("Vacation added successfully.");


        } catch (error) {
            console.log("couldnt add vacation", error);
            alert("Failed to add vacation.");   
        }
    };

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
                    onClick={() => setIsModalOpen(true)}
                    // sx={{ mb: 2 }}
                >
                    Add Vacation
                </Button>
                {/* <AddVacationModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddVacation={handleAddVacation}
                /> */}

                <Grid container spacing={4}>
                    {isLoading ? (
                        <Typography variant="h5" align="center">
                            Loading...
                        </Typography>
                    ) : vacations.map((vacation: any) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={vacation.vacation_id}>
                            <AdminVacationCard
                                vacation={vacation}
                                isAdmin={true} // Indicates this is for admin
                                onEdit={() => alert("Edit Vacation Modal Coming Soon!")}
                                onDelete={() => {
                                    setVacationToDelete(vacation.vacation_id);
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Delete Confirmation Dialog */}
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
