import UserRepository from "./../repositories/userRepository";

import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { IUser } from "./../models/_interfaces/UserInterfaces";
import { CheckDeleteUser, CheckFollowUser, CheckGetUser, CheckUpdateUser } from "./validations/userValidations";

/**
 * Fonction pour obtenir tous les utilisateurs
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        // Récupération de tous les utilisateurs sans les champs email, password et updatedAt
        const users = await UserRepository.getUsers({ email: 0, password: 0, updatedAt: 0 });

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

/**
 * Fonction pour obtenir un utilisateur par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getUser = async (req: Request, res: Response) => {

    // Vérification des données de récupération de l'utilisateur
    const CheckGetUserResult = await CheckGetUser(req);

    // Récupération de l'utilisateur
    const user = CheckGetUserResult.user;

    if (CheckGetUserResult.status !== 200) {
        return res.status(CheckGetUserResult.status).json({message: CheckGetUserResult.message});
    }

    res.status(200).json(user);
};

/**
 * Fonction pour modifier un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const updateUser = async (req: Request, res: Response) => {

    // Vérification des données de modification de l'utilisateur
    const CheckUpdateUserResult = await CheckUpdateUser(req);

    // Récupération de l'utilisateur à modifier
    const userToUpdate = CheckUpdateUserResult.user;

    if (CheckUpdateUserResult.status !== 200) {
        return res.status(CheckUpdateUserResult.status).json({message: CheckUpdateUserResult.message});
    }

    try {
        // Création de l'objet de mise à jour
        const updates: IUser = userToUpdate;

        // Parcours des données à modifier
        for (const [key, value] of Object.entries(req.body)) {

            // Exclusion des données à ne pas modifier
            if (key !== "userId" && key !== "isAdmin") {
                (updates as any)[key] = value;
            }
        }

        // Vérifie si le mot de passe a été modifié
        if (updates.password) {
            try {
                // Hashage du mot de passe
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(updates.password, salt);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Could not hash password" });
            }
        }

        // Mise à jour de l'utilisateur
        await UserRepository.updateUser(updates);
        res.status(200).json({ message: "Account has been updated" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }    
};

/**
 * Fonction pour supprimer un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const deleteUser = async (req: Request, res: Response) => {

    // Vérification des données de suppression de l'utilisateur
    const CheckDeleteUserResult = await CheckDeleteUser(req);

    // Récupération du pseudo de l'utilisateur à supprimer
    const pseudo = CheckDeleteUserResult.pseudo;

    try {
        // Suppression de l'utilisateur
        await UserRepository.deleteUser(pseudo);
        return res.status(200).json({ message: "Account has been deleted." });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};

/**
 * Fonction pour suivre un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const followUser = async (req: Request, res: Response) => {

    // Vérification des données de suivi de l'utilisateur
    const CheckFollowUserResult = await CheckFollowUser(req);

    // Récupération du pseudo de l'utilisateur courant et de l'utilisateur à suivre
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToFollowPseudo = CheckFollowUserResult.userToFollowPseudo;

    try {
        // Ajout de l'utilisateur à suivre dans la liste des utilisateurs suivis et de l'utilisateur courant dans la liste des utilisateurs qui suivent
        await UserRepository.followUser(currentPseudo, userToFollowPseudo);
        return res.status(200).json({ message: "User has been followed." });        
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};

/**
 * Fonction pour ne plus suivre un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const unfollowUser = async (req: Request, res: Response) => {

    // Vérification des données de suivi de l'utilisateur
    const CheckFollowUserResult = await CheckFollowUser(req);

    // Récupération du pseudo de l'utilisateur courant et de l'utilisateur à suivre
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToUnfollowPseudo = CheckFollowUserResult.userToFollowPseudo;

    try {
        // Suppression de l'utilisateur à suivre dans la liste des utilisateurs suivis et de l'utilisateur courant dans la liste des utilisateurs qui suivent
        await UserRepository.unfollowUser(currentPseudo, userToUnfollowPseudo);
        return res.status(200).json({ message: "User has been unfollowed." });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};