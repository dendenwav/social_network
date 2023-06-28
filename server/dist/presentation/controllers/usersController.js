"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    const pseudo = req.params.id;
    try {
        const user = await userRepository_1.default.getUserByPseudo(pseudo, { email: 0, password: 0, updatedAt: 0 });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve user" });
    }
};
exports.getUser = getUser;
//update user
const updateUser = async (req, res) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo)
            return res.status(404).json({ message: "currentUser not found." });
        const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!currentUser)
            return res.status(404).json({ message: "currentUser not found." });
        const userToUpdate = await userRepository_1.default.getUserByPseudo(req.body.userId);
        if (!userToUpdate)
            return res.status(404).json({ message: "User not found." });
        if (currentUser.pseudo === userToUpdate.pseudo || currentUser.isAdmin) {
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
            try {
                const userUpdated = await userRepository_1.default.updateUser(updates);
                if (!userUpdated)
                    return res.status(404).json({ error: "User not found ? (bizarre...)" });
                res.status(200).json({ message: "Account has been updated" });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Could not update user" });
            }
        }
        else {
            return res.status(403).json({ error: "You can only update your own account" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }
};
exports.updateUser = updateUser;
//delete user
const deleteUser = async (req, res) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo)
            return res.status(404).json({ message: "currentUser not found." });
        const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!currentUser)
            return res.status(404).json({ message: "currentUser not found." });
        const userToDelete = await userRepository_1.default.getUserByPseudo(req.params.id);
        if (!userToDelete)
            return res.status(404).json({ message: "User not found." });
        if (currentUser.pseudo === userToDelete.pseudo || currentUser.isAdmin) {
            await userRepository_1.default.deleteUser(userToDelete.pseudo);
            return res.status(200).json({ message: "Account has been deleted." });
        }
        else {
            return res.status(403).json({ message: "You can delete only your account." });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};
exports.deleteUser = deleteUser;
//follow a user
const followUser = async (req, res) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo)
            return res.status(404).json({ message: "currentUser not found." });
        const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!currentUser)
            return res.status(404).json({ message: "currentUser not found." });
        const userToFollow = await userRepository_1.default.getUserByPseudo(req.params.id);
        if (!userToFollow)
            return res.status(404).json({ message: "User not found." });
        if (currentUser.pseudo === userToFollow.pseudo)
            return res.status(403).json({ message: "You can't follow yourself." });
        if (!currentUser.followings || !userToFollow.followers)
            return res.status(500).json({ message: "A data inconsistency has occurred. Please retry the operation." });
        if (!currentUser.followings.includes(userToFollow.pseudo) && !userToFollow.followers.includes(currentUser.pseudo)) {
            await userRepository_1.default.followUser(currentUser.pseudo, userToFollow.pseudo);
            return res.status(200).json({ message: "User has been followed." });
        }
        else if (currentUser.followings.includes(userToFollow.pseudo) && userToFollow.followers.includes(currentUser.pseudo)) {
            return res.status(403).json({ message: "You already follow this user." });
        }
        else {
            await userRepository_1.default.unfollowUser(currentUser.pseudo, userToFollow.pseudo);
            return res.status(500).json({ message: "A data inconsistency has occurred. By default, you won't follow the user you're trying to follow. Please retry the operation if you really want to follow it." });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.followUser = followUser;
//unfollow a user
const unfollowUser = async (req, res) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo)
            return res.status(404).json({ message: "currentUser not found." });
        const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!currentUser)
            return res.status(404).json({ message: "currentUser not found." });
        const userToUnfollow = await userRepository_1.default.getUserByPseudo(req.params.id);
        if (!userToUnfollow)
            return res.status(404).json({ message: "User not found." });
        if (currentUser.pseudo === userToUnfollow.pseudo)
            return res.status(403).json({ message: "You can't unfollow yourself." });
        if (!currentUser.followings || !userToUnfollow.followers)
            return res.status(500).json({ message: "A data inconsistency has occurred. Please retry the operation." });
        if (currentUser.followings.includes(userToUnfollow.pseudo) && userToUnfollow.followers.includes(currentUser.pseudo)) {
            await userRepository_1.default.unfollowUser(currentUser.pseudo, userToUnfollow.pseudo);
            return res.status(200).json({ message: "User has been unfollowed." });
        }
        else if (!currentUser.followings.includes(userToUnfollow.pseudo) && !userToUnfollow.followers.includes(currentUser.pseudo)) {
            return res.status(403).json({ message: "You already don't follow this user." });
        }
        else {
            await userRepository_1.default.unfollowUser(currentUser.pseudo, userToUnfollow.pseudo);
            return res.status(500).json({ message: "A data inconsistency has occurred. By default, you won't follow the user you're trying to follow." });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.unfollowUser = unfollowUser;
