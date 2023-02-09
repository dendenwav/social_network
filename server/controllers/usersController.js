import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';

//get users
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { email: 0, password: 0, updatedAt: 0 });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

//get a user
export const getUser = async (req, res) => {
    const pseudo = req.params.id;
    try {
        const user = await UserModel.findOne({ pseudo });

        if (!user) return res.status(404).json({ error: "User not found" });

        const { email, password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve user" });
    }
};

//update user
export const updateUser = async (req, res) => {
    try {        
        const currentUser = await UserModel.findOne({ pseudo: req.params.id });
        const userToUpdate = await UserModel.findOne({ pseudo: req.body.userId });

        if (!userToUpdate) return res.status(404).json({ message: "User not found." });

        if (currentUser.pseudo === userToUpdate.pseudo || currentUser.isAdmin) {

            const updates = {};
            for (const [key, value] of Object.entries(req.body)) {
                if (key !== "userId" && key !== "isAdmin") {
                    updates[key] = value;
                }
            }

            if (updates.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    updates.password = await bcrypt.hash(updates.password, salt);
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Could not hash password" });
                }
            }

            try {
                const userUpdated = await UserModel.findOneAndUpdate({ pseudo: userToUpdate.pseudo }, {
                    $set: updates,
                });

                if (!userUpdated) return res.status(404).json({ error: "User not found ? (bizarre...)" });

                res.status(200).json({ message: "Account has been updated" });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Could not update user" });
            }
            
        } else {
            return res.status(403).json({ error: "You can only update your own account" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }
    
};

//delete user
export const deleteUser = async (req, res) => {  
    try {
        const currentUser = await UserModel.findOne({ pseudo: req.params.id });
        const userToDelete = await UserModel.findOne({ pseudo: req.body.userId });
    
        if (!userToDelete) return res.status(404).json({ message: "User not found." });
        if (!currentUser) return res.status(404).json({ message: "Current user doesn't exist." });

        if (currentUser.pseudo === userToDelete.pseudo || currentUser.isAdmin) {
            await UserModel.findOneAndDelete({ pseudo: userToDelete.pseudo });
            return res.status(200).json({ message: "Account has been deleted." });
        } else {
            return res.status(403).json({ message: "You can delete only your account." });
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};

//follow a user
export const followUser = async (req, res) => {
    try {
        const currentUser = await UserModel.findOne({ pseudo: req.params.id });
        const userToFollow = await UserModel.findOne({ pseudo: req.body.userId });
    
        if (!userToFollow) return res.status(404).json({ message: "User not found." });
        if (!currentUser) return res.status(404).json({ message: "Current user doesn't exist." });

        if (!currentUser.followings.includes(userToFollow.pseudo) && !userToFollow.followers.includes(currentUser.pseudo)) {
            await currentUser.updateOne({ $push: { followings: userToFollow.pseudo } });
            await userToFollow.updateOne({ $push: { followers: currentUser.pseudo } });
            return res.status(200).json({ message: "User has been followed." });
        } else if (currentUser.followings.includes(userToFollow.pseudo) && userToFollow.followers.includes(currentUser.pseudo)) {
            return res.status(403).json({ message: "You already follow this user." });
        } else {
            if (currentUser.followings.includes(userToFollow.pseudo)) await currentUser.updateOne({ $pull: { followings: userToFollow.pseudo } });
            if (userToFollow.followers.includes(currentUser.pseudo)) await userToFollow.updateOne({ $pull: { followers: currentUser.pseudo } });
            return res.status(500).json({ message: "A data inconsistency has occurred. By default, you won't follow the user you're trying to follow. Please retry the operation if you really want to follow it." });
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};

//unfollow a user
export const unfollowUser = async (req, res) => {    
    try {
        const currentUser = await UserModel.findOne({ pseudo: req.params.id });
        const userToUnfollow = await UserModel.findOne({ pseudo: req.body.userId });
    
        if (!userToUnfollow) return res.status(404).json({ message: "User not found." });
        if (!currentUser) return res.status(404).json({ message: "Current user doesn't exist." });

        if (currentUser.followings.includes(userToUnfollow.pseudo) && userToUnfollow.followers.includes(currentUser.pseudo)) {
            await currentUser.updateOne({ $pull: { followings: userToUnfollow.pseudo } });
            await userToUnfollow.updateOne({ $pull: { followers: currentUser.pseudo } });
            return res.status(200).json({ message: "User has been unfollowed." });
        } else if (!currentUser.followings.includes(userToUnfollow.pseudo) && !userToUnfollow.followers.includes(currentUser.pseudo)) {
            return res.status(403).json({ message: "You already don't follow this user." });
        } else {
            if (currentUser.followings.includes(userToUnfollow.pseudo)) await currentUser.updateOne({ $pull: { followings: userToUnfollow.pseudo } });
            if (userToUnfollow.followers.includes(currentUser.pseudo)) await userToUnfollow.updateOne({ $pull: { followers: currentUser.pseudo } });
            return res.status(500).json({ message: "A data inconsistency has occurred. By default, you won't follow the user you're trying to follow." });
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};