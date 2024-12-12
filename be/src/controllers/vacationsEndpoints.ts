import express, { Request, Response } from 'express';
import { getConnection } from '../utils/connectionUtils';
import { getRoleFromToken } from '../services/authService';
import { addVacation, deleteVacation, editVacation, getVacations, getVacationById } from '../services/vacationsService';
import { jwtDecode } from "jwt-decode";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadPath = path.join(__dirname, "../uploads");
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
            }
            cb(null, uploadPath); // Set the upload path
        } catch (err) {
            console.error("Error creating upload directory:", err);
            cb(err as Error, ""); // Pass the error to multer
        }
    },
    filename: (req, file, cb) => {
        const destination = req.body?.destination || "default"; // Fallback to 'default' if destination is missing
        const sanitizedDestination = destination.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // Sanitize filename
        const fileExtension = path.extname(file.originalname); // Preserve the original extension
        cb(null, `${sanitizedDestination}${fileExtension}`);// Set the filename
    },
});

// Create multer upload instance
const upload = multer({ storage });
// export { upload };

const vacationsEndpoints = express.Router();
vacationsEndpoints.get("/", async (req: Request, res: Response): Promise<void> => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
        return
    }


    try {
        const token = authorization.split(" ")[1];
        const role = getRoleFromToken(token); // Ensure token decoding works
        console.log("User role:", role);

        const data = await getVacations();
        res.json({ vacations: data });
    } catch (error) {
        console.error("Error fetching vacations:", error);
        res.status(500).json({ message: "Error fetching vacations" });
    }
});

import { NextFunction } from "express";

vacationsEndpoints.post(
    "/add",
    upload.single("image"), // Middleware for file uploads
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // console.log("Headers received in add:", req.headers);
            //ask gal if it is ok to make another authorization or to use the one from the middleware is ok
            const { authorization } = req.headers;
            if (!authorization || !authorization.startsWith("Bearer ")) {
                res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
                return;
            }

            const token = authorization.split(" ")[1]; // Extract token
            const role = getRoleFromToken(token);

            if (role !== "admin") {
                res.status(403).json({ message: "Forbidden: User is not admin." });
                return; // Ensure no further processing
            }

            const { destination, description, start_date, end_date, price } = req.body;

            if (!req.file) {
                res.status(400).json({ message: "Image file is required." });
                return; // Ensure no further processing
            }

            const imageName = req.file.filename;

            await addVacation(destination, description, start_date, end_date, price, imageName);

            res.status(201).json({ message: "Vacation added successfully!" });
        } catch (error: any) {
            console.error("Error in add vacation:", error);
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
);

vacationsEndpoints.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const token = req.headers.authorization as string;
    const decoded = jwtDecode<{ role?: string }>(token);
    const role = decoded.role;
    if (role !== "admin") {
        res.status(403).json({ message: "User is not admin" });
        return
    }

    try {
        await deleteVacation(id);
        res.json({ message: "Vacation deleted successfully" })
    } catch (error) {
        console.error("Error deleting vacation:", error);
        res.status(500).json({ message: "Error deleting vacation" })
    }
});

vacationsEndpoints.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const vacation = await getVacationById(id);
        if (!vacation) {
            res.status(404).json({ message: "Vacation not found" });
        }
        res.json(vacation);
    } catch (error) {
        console.error("Error fetching vacation:", error);
        res.status(500).json({ message: "Error fetching vacation" });
    }
});


vacationsEndpoints.put(
    "/edit/:id",
    upload.single("image"),
    async (req: Request, res: Response): Promise<void> => {
        console.log("Incoming headers:", req.headers);

        try {
            console.log("Headers:", req.headers);
            console.log("Body:", req.body);
            console.log("File:", req.file);

            const { destination, description, start_date, end_date, price } = req.body;
            if (!req.file) {
                res.status(400).json({ message: "Image file is required." });
                return;
            }
            const image = req.file.filename;
            const id = req.params.id;
            console.log("Vacation details:", { destination, description, start_date, end_date, price, image });
            if (!destination || !description || !start_date || !end_date || !price) {
                res.status(400).json({ message: "Missing required vacation details." });
                return;
            }

            await editVacation(id,destination,description,start_date,end_date,price,image);

            res.status(200).json({message: "Vacation updated successfully"});
        } catch (error) {
            console.error("Error editing vacation:", error);
            res.status(500).json({ message: "Error editing vacation" });
        }
    }
);

export { vacationsEndpoints };