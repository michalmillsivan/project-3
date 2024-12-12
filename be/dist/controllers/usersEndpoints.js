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
exports.usersEndpoints = void 0;
const express_1 = __importDefault(require("express"));
const connectionUtils_1 = require("../utils/connectionUtils");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const usersService_1 = require("../services/usersService");
dotenv_1.default.config();
const usersEndpoints = express_1.default.Router();
exports.usersEndpoints = usersEndpoints;
function extractBody(body) {
    const { email, first_name, last_name, password } = body;
    return { email, first_name, last_name, password };
}
//get all users
usersEndpoints.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getUsers();
        res.json({ users: data });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}));
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const users = yield (connection === null || connection === void 0 ? void 0 : connection.execute("SELECT * FROM users"));
        const result = users === null || users === void 0 ? void 0 : users[0];
        return result;
    });
}
//register
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    first_name: zod_1.z.string().min(1, { message: "First name is required." }),
    last_name: zod_1.z.string().min(1, { message: "Last name is required." }),
    password: zod_1.z.string().min(4, { message: "Password must be at least 4 characters long." })
});
//@ts-ignore
usersEndpoints.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = extractBody(req.body);
        registerSchema.parse(userData);
        const data = yield (0, usersService_1.register)(userData.first_name, userData.last_name, userData.email, userData.password, res);
        if (data === null) {
            return res.status(401).send("Invalid credentials");
        }
        else {
            res.json({ message: "Registration successful" });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json(error.issues);
        }
        else if (error.message === "Email already exists") {
            res.status(409).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}));
//login
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: zod_1.z.string().min(4, { message: "Password has to be at least 4 characters." }),
});
usersEndpoints.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Trying to login...");
        const { email, password } = loginSchema.parse(req.body);
        console.log("Validated input:", { email, password });
        console.log("Login Request Body:", req.body);
        const data = yield (0, usersService_1.loginUser)(email, password);
        if (!data) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        console.log("Parsed Input:", { email, password });
        console.log("User found, generating token...");
        const token = jsonwebtoken_1.default.sign({ email: data.email, role: data.role, first_name: data.first_name, user_id: data.user_id }, process.env.SECRET, { expiresIn: "10h" });
        res.json({ token, user: { email: data.email, first_name: data.first_name, user_id: data.user_id } });
        console.log("Token generated", token);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json(error.issues);
        }
        else {
            console.error("Error:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}));
