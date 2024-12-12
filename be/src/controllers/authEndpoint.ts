import express from 'express';
import { getRoleFromToken } from '../services/authService';
const authEndpoints = express.Router();

authEndpoints.get("/isAdmin", (req, res, next) => {
    const role = getRoleFromToken(req.headers.authorization as string);
    // console.log(role);
    if (role === "admin") {
        res.json({ message: "User is admin" })
    } else {
        res.status(403).json({ message: "User is not admin" })
    }

});

export { authEndpoints } 