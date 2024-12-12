import React from "react";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
} from "@mui/material";

type VacationCardProps = {
    vacation: {
        vacation_id: number;
        destination: string;
        description: string;
        start_date: string;
        end_date: string;
        price: string;
        image: string;
    };
    isAdmin?: boolean; 
    onEdit?: () => void; 
    onDelete?: () => void;
};

const AdminVacationCard: React.FC<VacationCardProps> = ({ vacation, isAdmin, onEdit, onDelete }) => {
    console.log("vacation.image", vacation.image);
    return (
        <Card sx={{ maxWidth: 345 , minWidth: 288, minHeight: 393}}>
            {vacation.image ? (
            <CardMedia
                component="img"
                height="140"
                image={ `http://localhost:3000/uploads/${vacation.image}`} 
                alt={vacation.destination}
            />
            ):(
                <Typography variant="body2" color="text.secondary">
                    Loading Image...
                </Typography>
            )}
            <CardContent>
                <Typography variant="h5" component="div">
                    {vacation.destination}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {vacation.description}
                    <br />
                    <strong>Start:</strong> {new Date(vacation.start_date).toLocaleDateString()}
                    <br />
                    <strong>End:</strong> {new Date(vacation.end_date).toLocaleDateString()}
                    <br />
                    <strong>Price:</strong> ${vacation.price}
                </Typography>
            </CardContent>
            {isAdmin && (
                <CardActions>
                    <Button variant="outlined" color="primary" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default AdminVacationCard;
