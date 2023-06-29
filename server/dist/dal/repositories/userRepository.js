"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../../models/UserModel"));
class UserRepository {
    static async createUser(userData) {
        const newUser = new UserModel_1.default(userData);
        return newUser.save();
    }
    static async getUsers(elementsToIgnored) {
        return await UserModel_1.default.find({}, elementsToIgnored);
    }
    static async getUserByPseudo(pseudo, elementsToIgnored) {
        return await UserModel_1.default.findOne({ pseudo: pseudo }, elementsToIgnored);
    }
    static async getUserByEmail(email) {
        return await UserModel_1.default.findOne({ email: email });
    }
    static async updateUser(updatedUserData) {
        const resultUser = await UserModel_1.default.findByIdAndUpdate(updatedUserData._id, updatedUserData, { new: true });
        const emptyUser = {
            pseudo: "",
        };
        if (resultUser)
            return resultUser;
        return emptyUser;
    }
    static async deleteUser(userId) {
        return UserModel_1.default.findByIdAndDelete(userId);
    }
    static async followUser(userId, userToFollowId) {
        return (UserModel_1.default.findByIdAndUpdate(userId, { $push: { followings: userToFollowId } }, { new: true }),
            UserModel_1.default.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true }));
    }
    static async unfollowUser(userId, userToUnfollowId) {
        return (UserModel_1.default.findByIdAndUpdate(userId, { $pull: { followings: userToUnfollowId } }, { new: true }),
            UserModel_1.default.findByIdAndUpdate(userToUnfollowId, { $pull: { followers: userId } }, { new: true }));
    }
}
exports.default = UserRepository;
