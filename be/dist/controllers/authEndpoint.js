"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authEndpoints = void 0;
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const authEndpoints = express_1.default.Router();
exports.authEndpoints = authEndpoints;
authEndpoints.get("/isAdmin", (req, res, next) => {
    const role = (0, authService_1.getRoleFromToken)(req.headers.authorization);
    // console.log(role);
    if (role === "admin") {
        res.json({ message: "User is admin" });
    }
    else {
        res.status(403).json({ message: "User is not admin" });
    }
});
