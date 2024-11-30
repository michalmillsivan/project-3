// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Modal,
//   Grid,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// const EditVacationModal = ({
//   open,
//   onClose,
//   onEditVacation,
//   vacation,
// }: {
//   open: boolean;
//   onClose: () => void;
//   onEditVacation: (updatedVacation: {
//     destination: string;
//     description: string;
//     start_date: Date | null;
//     end_date: Date | null;
//     price: string;
//     image?: File | null;
//   }) => void;
//   vacation: {
//     destination: string;
//     description: string;
//     start_date: string;
//     end_date: string;
//     price: string;
//     image?: string;
//   };
// }) => {
//   const [destination, setDestination] = useState("");
//   const [description, setDescription] = useState("");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState<File | null>(null);

//   useEffect(() => {
//     if (vacation) {
//       setDestination(vacation.destination);
//       setDescription(vacation.description);
//       setStartDate(new Date(vacation.start_date));
//       setEndDate(new Date(vacation.end_date));
//       setPrice(vacation.price);
//       setImage(null); // Image upload is optional
//     }
//   }, [vacation]);

//   const handleSubmit = () => {
//     if (!destination || !description || !startDate || !endDate || !price) {
//       alert("All fields except image are required!");
//       return;
//     }

//     onEditVacation({
//       destination,
//       description,
//       start_date: startDate,
//       end_date: endDate,
//       price,
//       image,
//     });
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           width: 400,
//           margin: "100px auto",
//           backgroundColor: "white",
//           padding: 4,
//           borderRadius: 2,
//           boxShadow: 24,
//         }}
//       >
//         <Typography variant="h6" align="center" gutterBottom>
//           Edit Vacation
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Destination"
//               fullWidth
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Description"
//               multiline
//               rows={4}
//               fullWidth
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Price"
//               type="number"
//               fullWidth
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Button
//               variant="outlined"
//               component="label"
//               fullWidth
//               startIcon={<AddPhotoAlternateIcon />}
//             >
//               Upload New Image (Optional)
//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={(e) =>
//                   setImage(e.target.files ? e.target.files[0] : null)
//                 }
//               />
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={handleSubmit}
//             >
//               Save Changes
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               fullWidth
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </Modal>
//   );
// };

// export default EditVacationModal;
