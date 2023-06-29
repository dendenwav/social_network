"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidations_1 = require("../validations/userValidations");
//get users
const getUsers = async (req, res) => {
    try {
        const users = await userRepository_1.default.getUsers({ email: 0, password: 0, updatedAt: 0 });
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
exports.getUsers = getUsers;
//get a user
const getUser = async (req, res) => {
    const CheckGetUserResult = await (0, userValidations_1.CheckGetUser)(req);
    const user = CheckGetUserResult.user;
    if (CheckGetUserResult.status !== 200) {
        return res.status(CheckGetUserResult.status).json({ message: CheckGetUserResult.message });
    }
    res.status(200).json(user);
};
exports.getUser = getUser;
//update user
const updateUser = async (req, res) => {
    const CheckUpdateUserResult = await (0, userValidations_1.CheckUpdateUser)(req);
    const userToUpdate = CheckUpdateUserResult.user;
    if (CheckUpdateUserResult.status !== 200) {
        return res.status(CheckUpdateUserResult.status).json({ message: CheckUpdateUserResult.message });
    }
    try {
        const updates = userToUpdate;
        for (const [key, value] of Object.entries(req.body)) {
            if (key !== "userId" && key !== "isAdmin") {
                updates[key] = value;
            }
        }
        if (updates.password) {
            try {
                const salt = await bcrypt_1.default.genSalt(10);
                updates.password = await bcrypt_1.default.hash(updates.password, salt);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Could not hash password" });
            }
        }
        await userRepository_1.default.updateUser(updates);
        res.status(200).json({ message: "Account has been updated" });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }
};
exports.updateUser = updateUser;
//delete user
const deleteUser = async (req, res) => {
    const CheckDeleteUserResult = await (0, userValidations_1.CheckDeleteUser)(req);
    const pseudo = CheckDeleteUserResult.pseudo;
    try {
        await userRepository_1.default.deleteUser(pseudo);
        return res.status(200).json({ message: "Account has been deleted." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};
exports.deleteUser = deleteUser;
//follow a user
const followUser = async (req, res) => {
    const CheckFollowUserResult = await (0, userValidations_1.CheckFollowUser)(req);
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToFollowPseudo = CheckFollowUserResult.userToFollowPseudo;
    try {
        await userRepository_1.default.followUser(currentPseudo, userToFollowPseudo);
        return res.status(200).json({ message: "User has been followed." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.followUser = followUser;
//unfollow a user
const unfollowUser = async (req, res) => {
    const CheckFollowUserResult = await (0, userValidations_1.CheckFollowUser)(req);
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToUnfollowPseudo = CheckFollowUserResult.userToFollowPseudo;
    try {
        await userRepository_1.default.unfollowUser(currentPseudo, userToUnfollowPseudo);
        return res.status(200).json({ message: "User has been unfollowed." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.unfollowUser = unfollowUser;
