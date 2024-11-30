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
    isAdmin?: boolean; // Indicates if the card is for the admin view
    onEdit?: () => void; // Edit button handler
    onDelete?: () => void; // Delete button handler
};

const AdminVacationCard: React.FC<VacationCardProps> = ({ vacation, isAdmin, onEdit, onDelete }) => {
    return (
        <Card sx={{ maxWidth: 345 , minWidth: 288, minHeight: 393}}>
            <CardMedia
                component="img"
                height="140"
                image={new URL(`../../images/${vacation.image}`, import.meta.url).href}
                alt={vacation.destination}
            />
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
