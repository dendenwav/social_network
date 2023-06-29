import UserRepository from "../../dal/repositories/userRepository";

import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { IUser } from "../../models/_interfaces/UserInterfaces";
import { CheckDeleteUser, CheckFollowUser, CheckGetUser, CheckUpdateUser } from "../validations/userValidations";

//get users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserRepository.getUsers({ email: 0, password: 0, updatedAt: 0 });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

//get a user
export const getUser = async (req: Request, res: Response) => {
    const CheckGetUserResult = await CheckGetUser(req);
    const user = CheckGetUserResult.user;

    if (CheckGetUserResult.status !== 200) {
        return res.status(CheckGetUserResult.status).json({message: CheckGetUserResult.message});
    }

    res.status(200).json(user);
};

//update user
export const updateUser = async (req: Request, res: Response) => {
    const CheckUpdateUserResult = await CheckUpdateUser(req);
    const userToUpdate = CheckUpdateUserResult.user;

    if (CheckUpdateUserResult.status !== 200) {
        return res.status(CheckUpdateUserResult.status).json({message: CheckUpdateUserResult.message});
    }

    try {
        const updates: IUser = userToUpdate;
        for (const [key, value] of Object.entries(req.body)) {
            if (key !== "userId" && key !== "isAdmin") {
                (updates as any)[key] = value;
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

        await UserRepository.updateUser(updates);
        res.status(200).json({ message: "Account has been updated" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }    
};

//delete user
export const deleteUser = async (req: Request, res: Response) => {
    const CheckDeleteUserResult = await CheckDeleteUser(req);
    const pseudo = CheckDeleteUserResult.pseudo;

    try {
        await UserRepository.deleteUser(pseudo);
        return res.status(200).json({ message: "Account has been deleted." });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};

//follow a user
export const followUser = async (req: Request, res: Response) => {
    const CheckFollowUserResult = await CheckFollowUser(req);
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToFollowPseudo = CheckFollowUserResult.userToFollowPseudo;

    try {        
        await UserRepository.followUser(currentPseudo, userToFollowPseudo);
        return res.status(200).json({ message: "User has been followed." });        
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};

//unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
    const CheckFollowUserResult = await CheckFollowUser(req);
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToUnfollowPseudo = CheckFollowUserResult.userToFollowPseudo;

    try {        
        await UserRepository.unfollowUser(currentPseudo, userToUnfollowPseudo);
        return res.status(200).json({ message: "User has been unfollowed." });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};