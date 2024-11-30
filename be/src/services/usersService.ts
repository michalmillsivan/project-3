import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user:{role:string}
        }
    }
}

//authorize middleware
export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Unauthorized. Please log in." });
        return; 
    }

    if (user.role !== "admin") {        
        res.status(403).json({ message: "Forbidden. Admin access only." });
        return; 
    }
}




// Middleware to authenticate the token and attach user data to the request
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token", token);

    if (!token) {
        res.status(401).json({ message: "Unauthorized. Token is missing." });
        return; // Ensure middleware terminates
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden. Invalid token." });
            return; // Ensure middleware terminates
        }

        req.user = user as { role: string }; // Attach user info to the request
        next(); // Pass control to the next middleware
    });
}



