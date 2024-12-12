"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.getTokenFromHeaders = getTokenFromHeaders;
exports.getRoleFromToken = getRoleFromToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    console.log("Intercepted URL:", req.url);
    console.log("start authenticateToken");
    const token = getTokenFromHeaders(req);
    console.log("extracted Token", token);
    if (!token) {
        console.log("Authorization header is missing or invalid");
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        console.log("decoded token from authenticateToken:", decoded);
        req.user = decoded;
        console.log("req.user", req.user);
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
}
function getTokenFromHeaders(req) {
    console.log("getTokenFromHeaders start");
    const authHeader = req.headers.authorization;
    console.log("authHeader from getTokenFromHeaders", authHeader);
    if (authHeader && authHeader.startsWith("Bearer ")) {
        console.log("authHeader from getTokenFromHeaders", authHeader.split(" ")[1]);
        return authHeader.split(" ")[1];
    }
    return null;
}
function getRoleFromToken(token) {
    console.log("getRoleFromToken start");
    try {
        console.log("token in getRoleFromToken:", token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        console.log("Decoded token in getRoleFromToken:", decoded);
        if (!decoded || !decoded.role) {
            console.log("Invalid token structure");
            throw new Error("Invalid token structure");
        }
        return (decoded === null || decoded === void 0 ? void 0 : decoded.role) || null;
    }
    catch (error) {
        console.error("Failed to decode token in getRoleFromToken:", error.message);
        return null;
    }
}
