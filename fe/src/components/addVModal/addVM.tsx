import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface AddVacationModalProps {
  open: boolean;
  onClose: () => void;
  onAddVacation: (vacation: {
    destination: string;
    description: string;
    start_date: Date | null;
    end_date: Date | null;
    price: string;
    image: File | null;
  }) => void;
}

const AddVacationModal: React.FC<AddVacationModalProps> = ({
  open,
  onClose,
  onAddVacation,
}) => {
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleAddVacation = () => {
    if (!destination || !description || !startDate || !endDate || !price) {
      alert("Please fill in all required fields.");
      return;
    }
    onAddVacation({ destination, description, start_date: startDate, end_date: endDate, price, image });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add Vacation
        </Typography>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" onClick={handleAddVacation}>
            Add Vacation
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddVacationModal;
