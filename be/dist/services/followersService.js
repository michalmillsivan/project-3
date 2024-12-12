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
exports.getFollowers = getFollowers;
exports.addFollower = addFollower;
exports.deleteFollower = deleteFollower;
exports.toggleFollower = toggleFollower;
exports.getFollowersReport = getFollowersReport;
const connectionUtils_1 = require("../utils/connectionUtils");
function getFollowers() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const followers = yield (connection === null || connection === void 0 ? void 0 : connection.execute("SELECT * FROM followers"));
        const result = followers === null || followers === void 0 ? void 0 : followers[0];
        return result;
    });
}
function addFollower(user_id, vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const followers = yield (connection === null || connection === void 0 ? void 0 : connection.execute("INSERT INTO `michali_travels`.`followers` (`user_id`, `vacation_id`) VALUES (?, ?);", [user_id, vacation_id]));
        const result = followers === null || followers === void 0 ? void 0 : followers[0];
        return result;
    });
}
function deleteFollower(user_id, vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        const followers = yield (connection === null || connection === void 0 ? void 0 : connection.execute("DELETE FROM `michali_travels`.`followers` WHERE `user_id` = ? AND `vacation_id` = ?;", [user_id, vacation_id]));
        const result = followers === null || followers === void 0 ? void 0 : followers[0];
        return result;
    });
}
function toggleFollower(user_id, vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connectionUtils_1.getConnection)();
        // Fetch followers for the specific user and vacation
        const [rows] = yield (connection === null || connection === void 0 ? void 0 : connection.execute("SELECT * FROM `michali_travels`.`followers` WHERE `user_id` = ? AND `vacation_id` = ?;", [user_id, vacation_id]));
        // Check if the user is already following the vacation
        const isFollowing = rows.length > 0;
        if (isFollowing) {
            // User is already following; remove them
            yield deleteFollower(user_id, vacation_id);
            return { following: false };
        }
        else {
            // User is not following; add them
            yield addFollower(user_id, vacation_id);
            return { following: true };
        }
    });
}
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
