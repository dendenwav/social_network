"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.deletePost = exports.updatePost = exports.createPost = exports.getFriendsPosts = exports.getUserPosts = exports.getPost = exports.getPosts = void 0;
const PostRepository_1 = __importDefault(require("./../repositories/PostRepository"));
const postValidations_1 = require("./validations/postValidations");
/**
 * Fonction pour obtenir tous les posts
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getPosts = async (req, res) => {
    try {
        // Récupération de tous les posts
        const posts = await PostRepository_1.default.getPosts();
        res.status(200).json(posts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve all post." });
    }
};
exports.getPosts = getPosts;
/**
 * Fonction pour obtenir un post par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getPost = async (req, res) => {
    // Vérification des données de récupération du post
    const CheckGetPostResult = await (0, postValidations_1.CheckGetPost)(req);
    // Récupération du post
    const post = CheckGetPostResult.post;
    if (CheckGetPostResult.status !== 200) {
        return res.status(CheckGetPostResult.status).json({ message: CheckGetPostResult.message });
    }
    res.status(200).json(post);
};
exports.getPost = getPost;
/**
 * Fonction pour obtenir tous les posts d'un utilisateur par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getUserPosts = async (req, res) => {
    // Vérification des données de récupération des posts de l'utilisateur
    const CheckGetUserPostsResult = await (0, postValidations_1.CheckGetUserPosts)(req);
    // Récupération des posts de l'utilisateur
    const posts = CheckGetUserPostsResult.posts;
    if (CheckGetUserPostsResult.status !== 200) {
        return res.status(CheckGetUserPostsResult.status).json({ message: CheckGetUserPostsResult.message });
    }
    res.status(200).json(posts);
};
exports.getUserPosts = getUserPosts;
/**
 * Fonction pour obtenir tous les posts d'un utilisateur et de ses amis par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const getFriendsPosts = async (req, res) => {
    // Vérification des données de récupération des posts de l'utilisateur et de ses amis
    const CheckGetFriendsPostsResult = await (0, postValidations_1.CheckGetFriendsPosts)(req);
    // Récupération des posts de l'utilisateur et de ses amis
    const posts = CheckGetFriendsPostsResult.posts;
    res.status(200).json(posts);
};
exports.getFriendsPosts = getFriendsPosts;
/**
 * Fonction pour créer un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const createPost = async (req, res) => {
    // Verification des données de création du post
    const checkCreateResult = await (0, postValidations_1.CheckCreatePost)(req);
    // Récupération du post
    const post = checkCreateResult.post;
    if (checkCreateResult.status !== 200) {
        return res.status(checkCreateResult.status).json({ message: checkCreateResult.message });
    }
    try {
        // Création du post
        const newPost = await PostRepository_1.default.createPost({ userId: post.userId, message: post.message, selectedFile: post.selectedFile, tags: post.tags });
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: "Error during post creation." });
    }
};
exports.createPost = createPost;
/**
 * Fonction pour modifier un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const updatePost = async (req, res) => {
    // Vérification des données de modification du post
    const CheckUpdatePostResult = await (0, postValidations_1.CheckUpdatePost)(req);
    // Récupération du post
    const post = CheckUpdatePostResult.post;
    if (CheckUpdatePostResult.status !== 200) {
        return res.status(CheckUpdatePostResult.status).json({ message: CheckUpdatePostResult.message });
    }
    try {
        // Création de l'objet de mise à jour
        const updates = post;
        // Parcours des données à modifier
        for (const [key, value] of Object.entries(req.body)) {
            // Exclusion des données à ne pas modifier
            if (key !== "likes" && key !== "userId") {
                updates[key] = value;
            }
        }
        // Mise à jour du post
        await PostRepository_1.default.updatePost(updates);
        res.status(200).json({ message: "the post has been updated" });
    }
    catch (err) {
        return res.status(500).json({ message: "Error during post update." });
    }
};
exports.updatePost = updatePost;
/**
 * Fonction pour supprimer un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const deletePost = async (req, res) => {
    // Vérification des données de suppression du post
    const CheckDeletePostResult = await (0, postValidations_1.CheckDeletePost)(req);
    // Récupération de l'id du post
    const postId = CheckDeletePostResult.postId;
    if (CheckDeletePostResult.status !== 200) {
        return res.status(CheckDeletePostResult.status).json({ message: CheckDeletePostResult.message });
    }
    try {
        // Suppression du post
        await PostRepository_1.default.deletePost(postId);
        res.status(200).json({ message: "the post has been deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};
exports.deletePost = deletePost;
/**
 * Fonction pour liker ou disliker un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const likePost = async (req, res) => {
    // Vérification des données de like ou dislike du post
    const CheckLikePostResult = await (0, postValidations_1.CheckLikePost)(req);
    // Récupération du post, de l'id du post et de l'id de l'utilisateur
    const post = CheckLikePostResult.post;
    const postId = CheckLikePostResult.postId;
    const userId = CheckLikePostResult.userId;
    if (CheckLikePostResult.status !== 200) {
        return res.status(CheckLikePostResult.status).json({ message: CheckLikePostResult.message });
    }
    try {
        // Si l'utilisateur n'a pas déjà liké le post, il le like, sinon il le dislike
        if (!post.likes?.includes(userId)) {
            // Like du post
            await PostRepository_1.default.likePost(postId, userId);
            res.status(200).json("The post has been liked");
        }
        else {
            // Dislike du post
            await PostRepository_1.default.unlikePost(postId, userId);
            res.status(200).json("The post has been disliked");
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};
exports.likePost = likePost;
