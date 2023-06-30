"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidations_1 = require("../validations/userValidations");
/**
 * Fonction pour obtenir tous les utilisateurs
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getUsers = async (req, res) => {
    try {
        // Récupération de tous les utilisateurs sans les champs email, password et updatedAt
        const users = await userRepository_1.default.getUsers({ email: 0, password: 0, updatedAt: 0 });
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
exports.getUsers = getUsers;
/**
 * Fonction pour obtenir un utilisateur par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getUser = async (req, res) => {
    // Vérification des données de récupération de l'utilisateur
    const CheckGetUserResult = await (0, userValidations_1.CheckGetUser)(req);
    // Récupération de l'utilisateur
    const user = CheckGetUserResult.user;
    if (CheckGetUserResult.status !== 200) {
        return res.status(CheckGetUserResult.status).json({ message: CheckGetUserResult.message });
    }
    res.status(200).json(user);
};
exports.getUser = getUser;
/**
 * Fonction pour modifier un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const updateUser = async (req, res) => {
    // Vérification des données de modification de l'utilisateur
    const CheckUpdateUserResult = await (0, userValidations_1.CheckUpdateUser)(req);
    // Récupération de l'utilisateur à modifier
    const userToUpdate = CheckUpdateUserResult.user;
    if (CheckUpdateUserResult.status !== 200) {
        return res.status(CheckUpdateUserResult.status).json({ message: CheckUpdateUserResult.message });
    }
    try {
        // Création de l'objet de mise à jour
        const updates = userToUpdate;
        // Parcours des données à modifier
        for (const [key, value] of Object.entries(req.body)) {
            // Exclusion des données à ne pas modifier
            if (key !== "userId" && key !== "isAdmin") {
                updates[key] = value;
            }
        }
        // Vérifie si le mot de passe a été modifié
        if (updates.password) {
            try {
                // Hashage du mot de passe
                const salt = await bcrypt_1.default.genSalt(10);
                updates.password = await bcrypt_1.default.hash(updates.password, salt);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Could not hash password" });
            }
        }
        // Mise à jour de l'utilisateur
        await userRepository_1.default.updateUser(updates);
        res.status(200).json({ message: "Account has been updated" });
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the user" });
    }
};
exports.updateUser = updateUser;
/**
 * Fonction pour supprimer un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const deleteUser = async (req, res) => {
    // Vérification des données de suppression de l'utilisateur
    const CheckDeleteUserResult = await (0, userValidations_1.CheckDeleteUser)(req);
    // Récupération du pseudo de l'utilisateur à supprimer
    const pseudo = CheckDeleteUserResult.pseudo;
    try {
        // Suppression de l'utilisateur
        await userRepository_1.default.deleteUser(pseudo);
        return res.status(200).json({ message: "Account has been deleted." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
};
exports.deleteUser = deleteUser;
/**
 * Fonction pour suivre un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const followUser = async (req, res) => {
    // Vérification des données de suivi de l'utilisateur
    const CheckFollowUserResult = await (0, userValidations_1.CheckFollowUser)(req);
    // Récupération du pseudo de l'utilisateur courant et de l'utilisateur à suivre
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToFollowPseudo = CheckFollowUserResult.userToFollowPseudo;
    try {
        // Ajout de l'utilisateur à suivre dans la liste des utilisateurs suivis et de l'utilisateur courant dans la liste des utilisateurs qui suivent
        await userRepository_1.default.followUser(currentPseudo, userToFollowPseudo);
        return res.status(200).json({ message: "User has been followed." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.followUser = followUser;
/**
 * Fonction pour ne plus suivre un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const unfollowUser = async (req, res) => {
    // Vérification des données de suivi de l'utilisateur
    const CheckFollowUserResult = await (0, userValidations_1.CheckFollowUser)(req);
    // Récupération du pseudo de l'utilisateur courant et de l'utilisateur à suivre
    const currentPseudo = CheckFollowUserResult.currentPseudo;
    const userToUnfollowPseudo = CheckFollowUserResult.userToFollowPseudo;
    try {
        // Suppression de l'utilisateur à suivre dans la liste des utilisateurs suivis et de l'utilisateur courant dans la liste des utilisateurs qui suivent
        await userRepository_1.default.unfollowUser(currentPseudo, userToUnfollowPseudo);
        return res.status(200).json({ message: "User has been unfollowed." });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while following to this user." });
    }
};
exports.unfollowUser = unfollowUser;
