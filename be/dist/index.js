"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const usersEndpoints_1 = require("./controllers/usersEndpoints");
const vacationsEndpoints_1 = require("./controllers/vacationsEndpoints");
const followersEndpoints_1 = require("./controllers/followersEndpoints");
const authService_1 = require("./services/authService");
const authEndpoint_1 = require("./controllers/authEndpoint");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log("Hello from index.ts the app is running");
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get("/health-check", (req, res) => {
    res.json({ message: "Server is up - Docker/Not" });
});
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../src/uploads")));
app.use("/auth", usersEndpoints_1.usersEndpoints);
app.use(authService_1.authenticateToken);
app.use("/vacations", vacationsEndpoints_1.vacationsEndpoints);
app.use("/followers", followersEndpoints_1.followersEndpoints);
app.use("/authentication", authEndpoint_1.authEndpoints);
exports.default = app;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
