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
exports.getVacations = getVacations;
exports.addVacation = addVacation;
exports.editVacation = editVacation;
exports.deleteVacation = deleteVacation;
exports.getVacationById = getVacationById;
const connectionUtils_1 = require("../utils/connectionUtils");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function getVacations() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        if (!connection) {
            throw new Error("Unable to establish database connection");
        }
        const vacations = yield (connection === null || connection === void 0 ? void 0 : connection.execute("SELECT * FROM vacations ORDER BY start_date ASC"));
        const result = vacations === null || vacations === void 0 ? void 0 : vacations[0];
        return result;
    });
}
function addVacation(destination, description, start_date, end_date, price, image) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const vacations = yield (connection === null || connection === void 0 ? void 0 : connection.execute("INSERT INTO `michali_travels`.`vacations` (`destination`, `description`, `start_date`, `end_date`, `price`, `image`) VALUES (?, ?, ?, ?, ?, ?);", [destination, description, start_date, end_date, price, image]));
        const result = vacations === null || vacations === void 0 ? void 0 : vacations[0];
        return result;
    });
}
function editVacation(id, destination, description, start_date, end_date, price, image) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        console.log("connection was made in editVacation");
        const vacations = yield (connection === null || connection === void 0 ? void 0 : connection.execute("UPDATE `michali_travels`.`vacations` SET `destination` = ?, `description` = ?, `start_date` = ?, `end_date` = ?, `price` = ?, `image` = ? WHERE `vacation_id` = ?;", [destination, description, start_date, end_date, price, image, id]));
        console.log("vacations in editVacation", vacations);
        const result = vacations === null || vacations === void 0 ? void 0 : vacations[0];
        console.log("result of editVacationnnnn", result);
        return result;
    });
}
function deleteVacation(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, connectionUtils_1.getConnection)();
        if (!connection) {
            throw new Error("Unable to establish database connection");
        }
        try {
            const [rows] = yield connection.execute("SELECT image FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]);
            const imageFilename = (_a = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _a === void 0 ? void 0 : _a.image;
            if (imageFilename) {
                const imagePath = path_1.default.join(__dirname, "../uploads", imageFilename);
                try {
                    yield promises_1.default.unlink(imagePath);
                    // console.log(`Deleted image file: ${imagePath}`);
                }
                catch (error) {
                    console.error(`Failed to delete image file: ${imagePath}`, error);
                }
            }
            yield (connection === null || connection === void 0 ? void 0 : connection.execute("DELETE FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]));
            // console.log(`Vacation with ID ${id} deleted successfully.`);
        }
        catch (error) {
            console.error("Error deleting vacation:", error);
            throw error;
        }
    });
}
function getVacationById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        if (!connection) {
            throw new Error("Unable to establish database connection");
        }
        try {
            const [rows] = yield connection.execute("SELECT * FROM `michali_travels`.`vacations` WHERE `vacation_id` = ?;", [id]);
            const result = rows === null || rows === void 0 ? void 0 : rows[0];
            return result;
        }
        catch (error) {
            console.error("Error fetching vacation by ID:", error);
            throw error;
        }
    });
}
