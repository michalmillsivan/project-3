import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authenticateToken(req: any, res: any, next: any) {
    console.log("Intercepted URL:", req.url);
    console.log("start authenticateToken");
    const token = getTokenFromHeaders(req);
    console.log("extracted Token", token);

    if (!token) {
        console.log("Authorization header is missing or invalid");
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as { role: string; user_id: number };
        console.log("decoded token from authenticateToken:", decoded);
        req.user = decoded;
        console.log("req.user", req.user);

        next();
    } catch (error: any) {
        console.error("Error verifying token:", error.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
}

export function getTokenFromHeaders(req: Request): string | null {
    console.log("getTokenFromHeaders start");

    const authHeader = req.headers.authorization;
    console.log("authHeader from getTokenFromHeaders", authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
        console.log("authHeader from getTokenFromHeaders", authHeader.split(" ")[1]);

        return authHeader.split(" ")[1];
    }
    return null;
}

export function getRoleFromToken(token: string): string | null {
    console.log("getRoleFromToken start");
    try {
        console.log("token in getRoleFromToken:", token);

        const decoded = jwt.verify(token, process.env.SECRET as string) as { role?: string };

        console.log("Decoded token in getRoleFromToken:", decoded);

        if (!decoded || !decoded.role) {
            console.log("Invalid token structure");
            throw new Error("Invalid token structure");
        }

        return decoded?.role || null;
    } catch (error: any) {
        console.error("Failed to decode token in getRoleFromToken:", error.message);
        return null;
    }
}