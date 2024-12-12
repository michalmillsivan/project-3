import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import ResponsiveAppBar from "../../components/app-bar/app-bar"; // Ensure this path is correct
import coco from "./coco.jpg";
import kkk from "./kkk.jpg";
import flipflop from "./flipflop.jpg"

const AboutPage = () => {
    return (
        <div>
            {/* AppBar */}
            <ResponsiveAppBar />
            <Box sx={{ padding: "16px", marginTop: "64px" }}>
                {/* About Project Section */}
                <Typography variant="h3" align="center" gutterBottom>
                    About This Project
                </Typography>
                <Card sx={{ display: "flex", marginBottom: "32px", boxShadow: 3, alignItems: "center", }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            What is Michali Travels?
                        </Typography>
                        <Typography variant="body1">
                            Michali Travels is a web application designed to help users explore amazing vacation
                            destinations. Users can view vacations, follow their favorites, and even see real-time
                            data on what other users are enjoying. Admins have special privileges, including
                            managing vacations and accessing insightful reports.
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: "50%", hight: "10" }}
                        image={coco} // Replace with your project-related image URL
                        alt="About the project"
                    />
                </Card>

                {/* Features Section */}
                <Typography variant="h3" align="center" gutterBottom>
                    Project Features
                </Typography>
                <Card sx={{ display: "flex", marginBottom: "32px", boxShadow: 3, alignItems: "center" }}>
                    <CardMedia
                        component="img"
                        sx={{ width: "50%", hight: "10" }}
                        image={flipflop} // Replace with your features-related image URL
                        alt="Project Features"
                    />
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            Key Features
                        </Typography>
                        <Typography variant="body1">
                            - Users can browse a variety of vacation destinations.
                            <br />
                            - Real-time follower counts for each vacation.
                            <br />
                            - Admins can add, edit, and delete vacations.
                            <br />
                            - Interactive reports page with visual charts.
                            <br />
                            - Seamless and responsive design for all devices.
                        </Typography>
                    </CardContent>
                </Card>

                {/* About Me Section */}
                <Typography variant="h3" align="center" gutterBottom>
                    About Me
                </Typography>
                <Card sx={{ display: "flex", boxShadow: 3 , alignItems: "center"}}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            Who Am I?
                        </Typography>
                        <Typography variant="body1">
                            Hi! I'm Michal, a passionate full-stack developer who loves building creative and
                            interactive web applications. I enjoy working with modern technologies like React,
                            Node.js, and Material-UI, and I'm always eager to learn and grow in the world of
                            development.
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: "50%", hight: "10" }}
                        image={kkk} // Replace with your fun personal image URL
                        alt="About Me"
                    />
                </Card>
            </Box>
        </div>
    );
};

export default AboutPage;
