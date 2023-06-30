"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUnfollowUser = exports.CheckFollowUser = exports.CheckDeleteUser = exports.CheckUpdateUser = exports.CheckGetUser = exports.CheckIfCurrentUserExist = void 0;
const userRepository_1 = __importDefault(require("../../repositories/userRepository"));
/**
 * Fonction pour vérifier si l'utilisateur courant existe
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'utilisateur
 */
const CheckIfCurrentUserExist = async (req) => {
    // Récupération du pseudo de l'utilisateur
    const pseudo = req.user?.pseudo;
    // Création d'un utilisateur vide
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    // Vérifie si le pseudo est renseigné
    if (!pseudo) {
        return { status: 401, message: "Vous n'êtes pas connecté.", user: emptyUser };
    }
    // Essaie de récupérer l'utilisateur
    const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
    // Vérifie si l'utilisateur est trouvé
    if (!currentUser) {
        return { status: 401, message: "L'utilisateur est inconnue.", user: emptyUser };
    }
    return { status: 200, message: "Vous êtes connecté.", user: currentUser };
};
exports.CheckIfCurrentUserExist = CheckIfCurrentUserExist;
/**
 * Fonction pour vérifier les données de récuprération d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'utilisateur
 */
const CheckGetUser = async (req) => {
    // Récupération du pseudo de l'utilisateur
    const pseudo = req.params.id;
    // Création d'un utilisateur vide
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    try {
        // Essaie de récupérer l'utilisateur
        const user = await userRepository_1.default.getUserByPseudo(pseudo, { email: 0, password: 0, updatedAt: 0 });
        // Vérifie si l'utilisateur est trouvé
        if (!user) {
            return { status: 404, message: "L'utilisateur est inconnue.", user: emptyUser };
        }
        return { status: 200, message: "L'utilisateur est connue.", user: user };
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", user: emptyUser };
    }
};
exports.CheckGetUser = CheckGetUser;
/**
 * Fonction pour vérifier les données de modification d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'utilisateur
 */
const CheckUpdateUser = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, exports.CheckIfCurrentUserExist)(req);
    // Création d'un utilisateur vide
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, user: emptyUser };
    }
    try {
        // Essaie de récupérer l'utilisateur à modifier
        const userToUpdate = await userRepository_1.default.getUserByPseudo(req.body.userId);
        // Vérifie si l'utilisateur est trouvé
        if (!userToUpdate) {
            return { status: 404, message: "L'utilisateur est inconnue.", user: emptyUser };
        }
        // Vérifie si l'utilisateur courant est l'utilisateur à modifier ou l'administrateur
        if (currentUser.pseudo !== userToUpdate.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez modifier que votre propre compte.", user: emptyUser };
        }
        return { status: 200, message: "L'utilisateur a été correctement récupéré.", user: userToUpdate };
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", user: emptyUser };
    }
};
exports.CheckUpdateUser = CheckUpdateUser;
/**
 * Fonction pour vérifier les données de suppression d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le pseudo de l'utilisateur
 */
const CheckDeleteUser = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, exports.CheckIfCurrentUserExist)(req);
    // Récupération du pseudo de l'utilisateur à supprimer
    const pseudo = req.params.id;
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, pseudo: "" };
    }
    try {
        // Essaie de récupérer l'utilisateur à supprimer
        const userToDelete = await userRepository_1.default.getUserByPseudo(pseudo);
        // Vérifie si l'utilisateur est trouvé
        if (!userToDelete) {
            return { status: 404, message: "L'utilisateur est inconnue.", pseudo: "" };
        }
        // Vérifie si l'utilisateur courant est l'utilisateur à supprimer ou l'administrateur
        if (currentUser.pseudo !== pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez supprimer que votre propre compte.", pseudo: "" };
        }
        return { status: 200, message: "L'utilisateur a été correctement récupéré.", pseudo: pseudo };
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", pseudo: "" };
    }
};
exports.CheckDeleteUser = CheckDeleteUser;
/**
 * Fonction pour vérifier les données de suivi des utilisateurs
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les pseudos de l'utilisateur courant et de l'utilisateur à suivre
 */
const CheckFollowUser = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, exports.CheckIfCurrentUserExist)(req);
    // Récupération du pseudo de l'utilisateur à suivre
    const pseudo = req.params.id;
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, currentPseudo: "", userToFollowPseudo: "" };
    }
    try {
        // Essaie de récupérer l'utilisateur à suivre
        const userToFollow = await userRepository_1.default.getUserByPseudo(pseudo);
        // Vérifie si l'utilisateur est trouvé
        if (!userToFollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si l'utilisateur courant est l'utilisateur à suivre
        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si les champs followers et followings existent
        if (!currentUser.followings || !userToFollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si l'utilisateur courant suit l'utilisateur à suivre
        if (currentUser.followings.includes(pseudo) && userToFollow.followers.includes(currentUser.pseudo)) {
            return { status: 403, message: "Vous suivez déjà cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si une incohérence a été détectée entre les champs followers et followings
        if (!currentUser.followings.includes(pseudo) && userToFollow.followers.includes(currentUser.pseudo)
            || currentUser.followings.includes(pseudo) && !userToFollow.followers.includes(currentUser.pseudo)) {
            await userRepository_1.default.unfollowUser(currentUser.pseudo, pseudo);
            return { status: 403, message: "Une incohérence a été détectée. Par défaut, l'utilisateur a été désuivi.", currentPseudo: "", userToFollowPseudo: "" };
        }
        return { status: 200, message: "L'utilisateur a été correctement récupéré.", currentPseudo: currentUser.pseudo, userToFollowPseudo: pseudo };
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
    }
};
exports.CheckFollowUser = CheckFollowUser;
/**
 * Fonction pour vérifier les données de désabonnement des utilisateurs
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les pseudos de l'utilisateur courant et de l'utilisateur à désabonner
 */
const CheckUnfollowUser = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, exports.CheckIfCurrentUserExist)(req);
    // Récupération du pseudo de l'utilisateur à suivre
    const pseudo = req.params.id;
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, currentPseudo: "", userToFollowPseudo: "" };
    }
    try {
        // Essaie de récupérer l'utilisateur à désabonner
        const userToUnfollow = await userRepository_1.default.getUserByPseudo(pseudo);
        // Vérifie si l'utilisateur est trouvé
        if (!userToUnfollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si l'utilisateur courant est l'utilisateur à désabonner
        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas ne plus vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si les champs followers et followings existent
        if (!currentUser.followings || !userToUnfollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si l'utilisateur courant ne suit déjà pas l'utilisateur à désabonner
        if (!currentUser.followings.includes(pseudo) && !userToUnfollow.followers.includes(currentUser.pseudo)) {
            return { status: 403, message: "Vous ne suivez pas cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        // Vérifie si une incohérence a été détectée entre les champs followers et followings
        if (!currentUser.followings.includes(pseudo) && userToUnfollow.followers.includes(currentUser.pseudo)
            || currentUser.followings.includes(pseudo) && !userToUnfollow.followers.includes(currentUser.pseudo)) {
            await userRepository_1.default.unfollowUser(currentUser.pseudo, pseudo);
            return { status: 403, message: "Une incohérence a été détectée. Par défaut, l'utilisateur a été désuivi.", currentPseudo: "", userToFollowPseudo: "" };
        }
        return { status: 200, message: "L'utilisateur a été correctement récupéré.", currentPseudo: currentUser.pseudo, userToFollowPseudo: pseudo };
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
    }
};
exports.CheckUnfollowUser = CheckUnfollowUser;
