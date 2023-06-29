"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUnfollowUser = exports.CheckFollowUser = exports.CheckDeleteUser = exports.CheckUpdateUser = exports.CheckGetUser = exports.CheckIfCurrentUserExist = void 0;
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const CheckIfCurrentUserExist = async (req) => {
    const pseudo = req.user?.pseudo;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    if (!pseudo) {
        return { status: 401, message: "Vous n'êtes pas connecté.", user: emptyUser };
    }
    const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
    if (!currentUser) {
        return { status: 401, message: "L'utilisateur est inconnue.", user: emptyUser };
    }
    return { status: 200, message: "Vous êtes connecté.", user: currentUser };
};
exports.CheckIfCurrentUserExist = CheckIfCurrentUserExist;
const CheckGetUser = async (req) => {
    const pseudo = req.params.id;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    try {
        const user = await userRepository_1.default.getUserByPseudo(pseudo, { email: 0, password: 0, updatedAt: 0 });
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
const CheckUpdateUser = async (req) => {
    const currentUser = (await (0, exports.CheckIfCurrentUserExist)(req)).user;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };
    try {
        const userToUpdate = await userRepository_1.default.getUserByPseudo(req.body.userId);
        if (!userToUpdate) {
            return { status: 404, message: "L'utilisateur est inconnue.", user: emptyUser };
        }
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
const CheckDeleteUser = async (req) => {
    const currentUser = (await (0, exports.CheckIfCurrentUserExist)(req)).user;
    const pseudo = req.params.id;
    try {
        const userToDelete = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!userToDelete) {
            return { status: 404, message: "L'utilisateur est inconnue.", pseudo: "" };
        }
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
const CheckFollowUser = async (req) => {
    const currentUser = (await (0, exports.CheckIfCurrentUserExist)(req)).user;
    const pseudo = req.params.id;
    try {
        const userToFollow = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!userToFollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (!currentUser.followings || !userToFollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (currentUser.followings.includes(pseudo) && userToFollow.followers.includes(currentUser.pseudo)) {
            return { status: 403, message: "Vous suivez déjà cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
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
const CheckUnfollowUser = async (req) => {
    const currentUser = (await (0, exports.CheckIfCurrentUserExist)(req)).user;
    const pseudo = req.params.id;
    try {
        const userToUnfollow = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!userToUnfollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas ne plus vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (!currentUser.followings || !userToUnfollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
        if (!currentUser.followings.includes(pseudo) && !userToUnfollow.followers.includes(currentUser.pseudo)) {
            return { status: 403, message: "Vous ne suivez pas cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }
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
