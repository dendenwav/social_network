"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckLikePost = exports.CheckDeletePost = exports.CheckUpdatePost = exports.CheckCreatePost = exports.CheckGetFriendsPosts = exports.CheckGetUserPosts = exports.CheckGetPost = void 0;
const userValidations_1 = require("./userValidations");
const PostRepository_1 = __importDefault(require("../../repositories/PostRepository"));
const userRepository_1 = __importDefault(require("../../repositories/userRepository"));
/**
 * Fonction pour vérifier les données de récupération d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
const CheckGetPost = async (req) => {
    // Récupération de l'id du post
    const postId = req.params.postId;
    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    // Essaie de récupérer le post
    const post = await PostRepository_1.default.getPostById(postId);
    // Vérifie si le post est trouvé
    if (!post) {
        return { status: 404, message: "Post non trouvé.", post: emptyPost };
    }
    return { status: 200, message: "les données renseignées sont valides", post: post };
};
exports.CheckGetPost = CheckGetPost;
/**
 * Fonction pour vérifier les données de récupeation des posts d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les posts
 */
const CheckGetUserPosts = async (req) => {
    // Récupération de l'id de l'utilisateur
    const pseudo = req.params.userId;
    try {
        // Essaie de récupérer l'utilisateur
        const user = await userRepository_1.default.getUserByPseudo(pseudo);
        // Vérifie si l'utilisateur est trouvé
        if (!user) {
            return { status: 404, message: "Utilisateur non trouvé.", posts: [] };
        }
        // Essaie de récupérer les posts de l'utilisateur
        const posts = await PostRepository_1.default.getUserPosts(user.pseudo);
        // Vérifie si les posts sont trouvés
        if (!posts) {
            return { status: 404, message: "Aucun post trouvé.", posts: [] };
        }
        return { status: 200, message: "les données renseignées sont valides", posts: posts };
    }
    catch (err) {
        return { status: 500, message: "Erreur lors de la récupération des posts.", posts: [] };
    }
};
exports.CheckGetUserPosts = CheckGetUserPosts;
/**
 * Fonction pour vérifier les données de récupération des posts d'un utilisateur et de ses amis
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les posts
 */
const CheckGetFriendsPosts = async (req) => {
    // Récupération du pseudo de l'utilisateur
    const pseudo = req.params.userId;
    try {
        // Essaie de récupérer l'utilisateur
        const user = await userRepository_1.default.getUserByPseudo(pseudo);
        // Vérifie si l'utilisateur est trouvé
        if (!user) {
            return { status: 404, message: "Utilisateur non trouvé.", posts: [] };
        }
        // Essaie de récupérer les posts de l'utilisateur
        const userPosts = await PostRepository_1.default.getUserPosts(user.pseudo);
        // Vérifie si les posts sont trouvés
        if (!userPosts) {
            return { status: 404, message: "Aucun post trouvé.", posts: [] };
        }
        // Vérifie si le champs followings de l'utilisateur est undefined
        if (!user.followings) {
            return { status: 404, message: "Aucun ami trouvé.", posts: [] };
        }
        let erreur = false;
        // Essaie de récupérer les posts des amis de l'utilisateur
        const friendPosts = await Promise.all(user.followings.map((friendId) => {
            const friendPosts = PostRepository_1.default.getUserPosts(friendId);
            // Vérifie si les posts de chaque ami sont trouvés
            if (!friendPosts)
                erreur = true;
            return friendPosts;
        }));
        // Vérifie si une erreur est survenue ou si les posts des amis sont trouvés
        if (!friendPosts || erreur) {
            return { status: 404, message: "Aucun post trouvé.", posts: [] };
        }
        return { status: 200, message: "les données renseignées sont valides", posts: userPosts.concat(...friendPosts) };
    }
    catch (err) {
        return { status: 500, message: "Erreur lors de la récupération des posts.", posts: [] };
    }
};
exports.CheckGetFriendsPosts = CheckGetFriendsPosts;
/**
 * Fonction pour vérifier les données de création d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
const CheckCreatePost = async (req) => {
    // Récupération des données du post
    const { message, selectedFile, tags } = req.body;
    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, userValidations_1.CheckIfCurrentUserExist)(req);
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, post: emptyPost };
    }
    return { status: 200, message: "les données renseignées sont valides", post: { userId: currentUser.pseudo, message, selectedFile, tags } };
};
exports.CheckCreatePost = CheckCreatePost;
/**
 * Fonction pour vérifier les données de modification d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
const CheckUpdatePost = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, userValidations_1.CheckIfCurrentUserExist)(req);
    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, post: emptyPost };
    }
    try {
        // Essaie de récupérer le post à modifier
        const postToUpdate = await PostRepository_1.default.getPostById(req.body._id);
        // Vérifie si le post est trouvé
        if (!postToUpdate) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost };
        }
        // Vérifie si l'utilisateur courant est l'auteur du post ou s'il est admin
        if (postToUpdate.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez modifier que vos posts.", post: emptyPost };
        }
        return { status: 200, message: "les données renseignées sont valides", post: postToUpdate };
    }
    catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost };
    }
};
exports.CheckUpdatePost = CheckUpdatePost;
/**
 * Fonction pour vérifier les données de suppression d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'id du post
 */
const CheckDeletePost = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, userValidations_1.CheckIfCurrentUserExist)(req);
    // Récupération de l'id du post
    const postId = req.body.postId;
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, postId: "" };
    }
    try {
        // Essaie de récupérer le post à supprimer
        const postToDelete = await PostRepository_1.default.getPostById(postId);
        // Vérifie si le post est trouvé
        if (!postToDelete || !postToDelete.postId) {
            return { status: 404, message: "Post non trouvé.", postId: "" };
        }
        // Vérifie si l'utilisateur courant est l'auteur du post ou s'il est admin
        if (postToDelete.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez supprimer que vos posts.", postId: "" };
        }
        return { status: 200, message: "les données renseignées sont valides", postId: postId };
    }
    catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", postId: "" };
    }
};
exports.CheckDeletePost = CheckDeletePost;
/**
 * Fonction pour vérifier les données de like d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message, l'id du post, le post et l'id de l'utilisateur
 */
const CheckLikePost = async (req) => {
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await (0, userValidations_1.CheckIfCurrentUserExist)(req);
    // Récupération de l'id du post
    const postId = req.body.postId;
    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;
    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, post: emptyPost, userId: "", postId: "" };
    }
    try {
        // Essaie de récupérer le post à liker
        const postToLike = await PostRepository_1.default.getPostById(postId);
        // Vérifie si le post est trouvé
        if (!postToLike || !postToLike.postId) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost, userId: "", postId: "" };
        }
        return { status: 200, message: "les données renseignées sont valides", post: postToLike, userId: currentUser.pseudo, postId: postId };
    }
    catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost, userId: "", postId: "" };
    }
};
exports.CheckLikePost = CheckLikePost;
