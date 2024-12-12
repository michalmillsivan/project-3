import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { getVacationById, editVacationApi } from "./service";

const Edit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | string | null>(null);
   
    useEffect(() => {
        if (!id) {
            alert("Vacation ID is missing!");
            navigate("/admin");
            return;
        }

        const fetchVacationDetails = async () => {
            try {
                const vacation = await getVacationById(id);
                setDestination(vacation.destination);
                setDescription(vacation.description);
                setStartDate(new Date(vacation.start_date));
                setEndDate(new Date(vacation.end_date));
                setPrice(vacation.price);
            } catch (error) {
                console.error("Failed to fetch vacation details:", error);
                alert("Could not load vacation details.");
                navigate("/admin");
            }
        };

        fetchVacationDetails();
    }, [id, navigate]);

    const handleEditVacation = async () => {
        if (!id) {
            alert("Vacation ID is missing!");
            return;
        }
    
        if (!destination || !description || !startDate || !endDate || !price) {
            alert("All fields except image are required!");
            return;
        }
    
        if (Number(price) <= 0) {
            alert("Price must be greater than zero.");
            return;
        }
    
        if (endDate < startDate) {
            alert("End date cannot be earlier than the start date.");
            return;
        }
    
        try {
            await editVacationApi(id, {
                destination,
                description,
                start_date: startDate,
                end_date: endDate,
                price,
                image
            });    
            alert("Vacation updated successfully!");
            navigate("/admin");
        } catch (error) {
            console.error("Failed to edit vacation:", error);
            alert("Failed to update vacation.");
        }
    };
    

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                margin: "40px auto",
                padding: 4,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 24,
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Edit Vacation
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Destination"
                        fullWidth
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<AddPhotoAlternateIcon />}
                    >
                        Upload New Image (Optional)
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        />
                    </Button>
                </Grid>

                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleEditVacation}
                    >
                        Save Changes
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Edit;

