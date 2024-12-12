import { Request } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: { email: string;
                role: string;
                first_name: string;
                user_id: number; }
        }
    }
}