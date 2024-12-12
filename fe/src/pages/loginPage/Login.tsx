import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  console.log("Login page started");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //i have made changes here 25/11:
  const navigate = useNavigate();

  const handleLogin = async () => {
    //i have made changes here 25/11:
    try {
      console.log("try Logging in...");

      const response = await axios.post("http://localhost:3000/auth/login", { email, password });
      console.log("response.data: ", response.data);
      const { token, user } = response.data;
      const decoded = jwtDecode<{ role?: string }>(token);
      console.log("decoded:", decoded);
      
      console.log("decoded.role:", decoded.role);

      localStorage.setItem("token", token); // Save the token
      localStorage.setItem("user", JSON.stringify(user)); // Save user details
      alert("Login successful");

      if (decoded.role === "admin") {
        navigate("/admin");
      } else { navigate("/vacations"); }///will navigate to the vacations page
    } catch (error) {
      console.error(error);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;