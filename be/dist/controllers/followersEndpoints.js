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
exports.followersEndpoints = void 0;
exports.getFollowersReport = getFollowersReport;
const express_1 = __importDefault(require("express"));
const connectionUtils_1 = require("../utils/connectionUtils");
const followersService_1 = require("../services/followersService");
const followersEndpoints = express_1.default.Router();
exports.followersEndpoints = followersEndpoints;
followersEndpoints.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, followersService_1.getFollowers)();
        res.json({ users: data });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}));
followersEndpoints.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, vacation_id } = req.body;
    try {
        const data = yield (0, followersService_1.addFollower)(user_id, vacation_id);
        res.json({ users: data });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
    // res.json({ message: "Hello from users" });
}));
followersEndpoints.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, vacation_id } = req.body;
    try {
        const data = yield (0, followersService_1.deleteFollower)(user_id, vacation_id);
        res.json({ users: data });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
    res.json({
    // message: "Hello from users"
    });
}));
followersEndpoints.post("/toggle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, vacation_id } = req.body;
    try {
        const data = yield (0, followersService_1.toggleFollower)(user_id, vacation_id);
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error toggling follower" });
    }
}));
followersEndpoints.get("/report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getFollowersReport();
        res.json({ report: data });
    }
    catch (error) {
        console.error("Error fetching followers report:", error);
        res.status(500).json({ message: "Error fetching followers report" });
    }
}));
function getFollowersReport() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const [rows] = yield (connection === null || connection === void 0 ? void 0 : connection.execute(`
        SELECT v.destination, COUNT(f.user_id) AS follower_count
        FROM vacations v
        LEFT JOIN followers f ON v.vacation_id = f.vacation_id
        GROUP BY v.vacation_id, v.destination
        ORDER BY follower_count DESC
        `));
        return rows;
    });
}
