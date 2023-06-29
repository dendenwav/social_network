"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckLikePost = exports.CheckDeletePost = exports.CheckUpdatePost = exports.CheckCreatePost = void 0;
const userValidations_1 = require("./userValidations");
const PostRepository_1 = __importDefault(require("../../dal/repositories/PostRepository"));
const CheckCreatePost = async (req) => {
    const { message, selectedFile, tags } = req.body;
    const currentUser = (await (0, userValidations_1.CheckIfCurrentUserExist)(req)).user;
    return { status: 200, message: "les données renseignées sont valides", post: { userId: currentUser.pseudo, message, selectedFile, tags } };
};
exports.CheckCreatePost = CheckCreatePost;
const CheckUpdatePost = async (req) => {
    const currentUser = (await (0, userValidations_1.CheckIfCurrentUserExist)(req)).user;
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    try {
        const postToUpdate = await PostRepository_1.default.getPostById(req.body._id);
        if (!postToUpdate) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost };
        }
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
const CheckDeletePost = async (req) => {
    const currentUser = (await (0, userValidations_1.CheckIfCurrentUserExist)(req)).user;
    const postId = req.body.postId;
    try {
        const postToDelete = await PostRepository_1.default.getPostById(postId);
        if (!postToDelete || !postToDelete.postId) {
            return { status: 404, message: "Post non trouvé.", postId: "" };
        }
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
const CheckLikePost = async (req) => {
    const currentUser = (await (0, userValidations_1.CheckIfCurrentUserExist)(req)).user;
    const postId = req.body.postId;
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    try {
        const postToLike = await PostRepository_1.default.getPostById(postId);
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
