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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.loginUser = loginUser;
const connectionUtils_1 = require("../utils/connectionUtils");
function register(first_name, last_name, email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        if (!connection) {
            throw new Error("Failed to establish a database connection");
        }
        try {
            const result = yield connection.execute("INSERT INTO `michali_travels`.`users` (`first_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?);", [first_name, last_name, email, password]);
            if (!result) {
                throw new Error("Query execution failed");
            }
            const [rows] = result;
            return rows;
        }
        catch (error) {
            console.error("Error occurred:", error);
            // Handle specific error cases
            if (error.code === "ER_DUP_ENTRY") {
                res.status(409).json({ message: "Email already exists" });
            }
            else {
                res.status(500).json({ message: error.message || "Internal server error" });
            }
        }
    });
}
function loginUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        console.log("connection", connection);
        const result = yield (connection === null || connection === void 0 ? void 0 : connection.execute("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]));
        console.log("DB Query Result:", result);
        // console.log("result", result);
        if (!result) {
            return null;
        }
        const [rows] = result;
        console.log("rows", rows[0]);
        if (!rows || rows.length === 0) {
            return null;
        }
        return rows[0];
    });
}
// declare global {
//     namespace Express {
//         interface Request {
//             user:{role:string}
//         }
//     }
// }
// export function isAdmin(req: Request, res: Response, next: NextFunction): void {
//     const user = req.user;
//     if (!user) {
//         res.status(401).json({ message: "Unauthorized. Please log in." });
//         return; 
//     }
//     if (user.role !== "admin") {        
//         res.status(403).json({ message: "Forbidden. Admin access only." });
//         return; 
//     }
// }
