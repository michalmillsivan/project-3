import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bg from './bg.avif';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background for better text visibility
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Michali Travels
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Plan your perfect vacation with ease.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate("/login")}
                    sx={{ mb: 2 }}
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate("/register")}
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
