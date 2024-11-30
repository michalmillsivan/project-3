import React from "react";
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';

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
    followers: any[];
    user_id: number | null;
    handleFollow: (vacation_id: number) => void;
};

const VacationCard: React.FC<VacationCardProps> = ({
    vacation,
    followers,
    user_id,
    handleFollow,
}) => {
    const isFollowing = followers.some(
        (f) => f.user_id === user_id && f.vacation_id === vacation.vacation_id
    );

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
                    {/* <br />
                    <strong>Price:</strong> ${vacation.price} */}
                </Typography>
                <Button variant="contained">${vacation.price}</Button>
            </CardContent>
            <CardActions>
                <IconButton
                    aria-label="follow"
                    onClick={() => handleFollow(vacation.vacation_id)}
                >
                    <FavoriteIcon color={isFollowing ? "error" : "inherit"} />
                </IconButton>
                <Typography variant="body2">
                    <strong>Followers:</strong>{" "}
                    {
                        followers.filter((f) => f.vacation_id === vacation.vacation_id)
                            .length
                    }
                </Typography>
            </CardActions>
        </Card>
    );
};

export default VacationCard;
