"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationsEndpoints = void 0;
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const vacationsService_1 = require("../services/vacationsService");
const jwt_decode_1 = require("jwt-decode");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadPath = path_1.default.join(__dirname, "../uploads");
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
            }
            cb(null, uploadPath); // Set the upload path
        }
        catch (err) {
            console.error("Error creating upload directory:", err);
            cb(err, ""); // Pass the error to multer
        }
    },
    filename: (req, file, cb) => {
        var _a;
        const destination = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.destination) || "default"; // Fallback to 'default' if destination is missing
        const sanitizedDestination = destination.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // Sanitize filename
        const fileExtension = path_1.default.extname(file.originalname); // Preserve the original extension
        cb(null, `${sanitizedDestination}${fileExtension}`);
    },
});
// Create multer upload instance
const upload = (0, multer_1.default)({ storage });
// export { upload };
const vacationsEndpoints = express_1.default.Router();
exports.vacationsEndpoints = vacationsEndpoints;
vacationsEndpoints.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
        return;
    }
    try {
        const token = authorization.split(" ")[1];
        const role = (0, authService_1.getRoleFromToken)(token); // Ensure token decoding works
        console.log("User role:", role);
        const data = yield (0, vacationsService_1.getVacations)();
        res.json({ vacations: data });
    }
    catch (error) {
        console.error("Error fetching vacations:", error);
        res.status(500).json({ message: "Error fetching vacations" });
    }
}));
vacationsEndpoints.post("/add", upload.single("image"), // Middleware for file uploads
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Headers received in add:", req.headers);
        //ask gal if it is ok to make another authorization or to use the one from the middleware is ok
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
            return;
        }
        const token = authorization.split(" ")[1]; // Extract token
        const role = (0, authService_1.getRoleFromToken)(token);
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
        yield (0, vacationsService_1.addVacation)(destination, description, start_date, end_date, price, imageName);
        res.status(201).json({ message: "Vacation added successfully!" });
    }
    catch (error) {
        console.error("Error in add vacation:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}));
vacationsEndpoints.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    const decoded = (0, jwt_decode_1.jwtDecode)(token);
    const role = decoded.role;
    if (role !== "admin") {
        res.status(403).json({ message: "User is not admin" });
        return;
    }
    try {
        yield (0, vacationsService_1.deleteVacation)(id);
        res.json({ message: "Vacation deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting vacation:", error);
        res.status(500).json({ message: "Error deleting vacation" });
    }
}));
vacationsEndpoints.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vacation = yield (0, vacationsService_1.getVacationById)(id);
        if (!vacation) {
            res.status(404).json({ message: "Vacation not found" });
        }
        res.json(vacation);
    }
    catch (error) {
        console.error("Error fetching vacation:", error);
        res.status(500).json({ message: "Error fetching vacation" });
    }
}));
vacationsEndpoints.put("/edit/:id", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, vacationsService_1.editVacation)(id, destination, description, start_date, end_date, price, image);
        res.status(200).json({ message: "Vacation updated successfully" });
    }
    catch (error) {
        console.error("Error editing vacation:", error);
        res.status(500).json({ message: "Error editing vacation" });
    }
}));
// vacationsEndpoints.put(
//     "/edit/:id",
//     upload.single("image"),
//     async (req: Request, res: Response): Promise<void> => {
//         try {
//             const { destination, description, start_date, end_date, price } = req.body;
//             const id = req.params.id;
//             if (!destination || !description || !start_date || !end_date || !price) {
//                 res.status(400).json({ message: "Missing required vacation details." });
//                 return;
//             }
//             const oldVacation = await getVacationById(id);
//             if (!oldVacation) {
//                 res.status(404).json({ message: "Vacation not found." });
//                 return;
//             }
//             const oldImageName = `${oldVacation.destination.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
//             const oldImagePath = path.join(__dirname, "../uploads", oldImageName);
//             let newImageName = oldImageName;
//             if (req.file) {
//                 newImageName = `${destination.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-${Date.now()}${path.extname(req.file.originalname)}`;
//                 // Delete old image if a new one is uploaded
//                 if (fs.existsSync(oldImagePath) && oldImageName !== newImageName) {
//                     fs.unlinkSync(oldImagePath);
//                     console.log(`Deleted old image: ${oldImageName}`);
//                 }
//             }
//             await editVacation(
//                 id,
//                 destination,
//                 description,
//                 start_date,
//                 end_date,
//                 price,
//                 newImageName
//             );
//             if (req.file) {
//                 console.log("New image saved as:", newImageName);
//             }
//             res.status(200).json({
//                 message: "Vacation updated successfully",
//                 image: newImageName, // Return the updated image filename
//             });
//         } catch (error) {
//             console.error("Error editing vacation:", error);
//             res.status(500).json({ message: "Error editing vacation" });
//         }
//     }
// );
