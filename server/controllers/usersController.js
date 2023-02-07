import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';

//get users
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0, updatedAt: 0 });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

//get a user
export const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findById(userId);

        if (!user) {            
            return res.status(404).json({ error: "User not found" });
        }

        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve user" });
    }
};

//update user
export const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
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
            const user = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: updates,
            });
            if (!user) return res.status(404).json({ error: "User not found" });
            res.status(200).json({ message: "Account has been updated" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not update user" });
        }
    } else {
        return res.status(403).json({ error: "You can only update your own account" });
    }
};

//delete user
export const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
};

//follow a user
export const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you allready follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
};

//unfollow a user
export const unfollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you dont follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfollow yourself");
    }
};