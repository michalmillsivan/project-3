import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { addVacationApi } from "./service";
import { useNavigate } from "react-router-dom";

const AddVacationPage: React.FC = () => {
    console.log("Hello from AddVacationPage");

    const [destination, setDestination] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateFields = () => {
        const now = new Date();
        // console.log("Hello from validateFields");
        // console.log("today is: ", now); 
        if (!destination || !description || !startDate || !endDate || !price) {
            return "Please fill in all required fields.";
        }

        if (parseFloat(price) <= 0) {
            console.log("Price cannot be negative.");
            return "Price cannot be negative.";

        }

        if (startDate < now) {
            return "Start date cannot be in the past.";
        }

        if (endDate < now) {
            return "End date cannot be in the past.";
        }

        if (endDate <= startDate) {
            return "End date must be after start date.";
        }

        return null;
    };

    const handleAddVacation = async () => {
        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null); // Clear any previous errors

        const vacationData = {
            destination,
            description,
            start_date: startDate,
            end_date: endDate,
            price,
            image,
        };

        try {
            await addVacationApi(vacationData);
            alert("Vacation added successfully!");
            navigate("/admin"); // Redirect back to admin page
        } catch (error) {
            console.error("Error adding vacation:", error);
            alert("Failed to add vacation. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 4,
                    p: 4,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Add Vacation
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    fullWidth
                    label="Destination"
                    variant="outlined"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start On"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        slotProps={{
                            textField: { fullWidth: true },
                        }}
                    />
                    <Box sx={{ height: 16 }} />
                    <DatePicker
                        label="End On"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        slotProps={{
                            textField: { fullWidth: true },
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                />
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    Select Image
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                {imagePreview && (
                    <Box
                        sx={{
                            mt: 2,
                            mb: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: 200 }}
                        />
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddVacation}
                    >
                        Add Vacation
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddVacationPage;
