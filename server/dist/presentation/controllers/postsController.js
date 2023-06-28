"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.deletePost = exports.updatePost = exports.createPost = exports.getFriendsPosts = exports.getUserPosts = exports.getPost = exports.getPosts = void 0;
const PostRepository_1 = __importDefault(require("../../dal/repositories/PostRepository"));
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const postValidations_1 = require("../validations/postValidations");
//get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await PostRepository_1.default.getPosts();
        res.status(200).json(posts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve all post." });
    }
};
exports.getPosts = getPosts;
//get a post
const getPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await PostRepository_1.default.getPostById(postId);
        if (!post)
            return res.status(404).json({ error: "Post not found." });
        res.status(200).json(post);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve post." });
    }
};
exports.getPost = getPost;
//get user's posts
const getUserPosts = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userRepository_1.default.getUserByPseudo(userId);
        if (!user)
            return res.status(404).json({ error: "User not found." });
        const posts = await PostRepository_1.default.getUserPosts(user.pseudo);
        if (!posts)
            return res.status(404).json({ error: "User's posts not found." });
        res.status(200).json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's posts." });
    }
};
exports.getUserPosts = getUserPosts;
//get all posts from user and followings
const getFriendsPosts = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userRepository_1.default.getUserByPseudo(userId);
        if (!user)
            return res.status(404).json({ error: "User not found." });
        const userPosts = await PostRepository_1.default.getUserPosts(user.pseudo);
        if (!userPosts)
            return res.status(404).json({ error: "User's posts not found." });
        if (!user.followings)
            return res.status(404).json({ error: "User's followings not found." });
        const friendPosts = await Promise.all(user.followings.map((friendId) => {
            return PostRepository_1.default.getUserPosts(friendId);
        }));
        if (!friendPosts)
            return res.status(404).json({ error: "User's friends posts not found." });
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's friends posts." });
    }
};
exports.getFriendsPosts = getFriendsPosts;
//create a post
const createPost = async (req, res) => {
    const { message, selectedFile, tags } = req.body;
    const currentUserResult = (0, postValidations_1.CheckIfCurrentUserExist)(req);
    if (currentUserResult.status !== 200) {
        return res.status(currentUserResult.status).json(currentUserResult.message);
    }
    try {
        const newPost = await PostRepository_1.default.createPost({ userId: currentUserResult.pseudo, message, selectedFile, tags });
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: "Error during post creation." });
    }
};
exports.createPost = createPost;
//update a post
const updatePost = async (req, res) => {
    const userId = req.user?.pseudo;
    try {
        const postToUpdate = await PostRepository_1.default.getPostById(req.body._id);
        if (!postToUpdate)
            return res.status(404).json({ message: "Post not found." });
        if (postToUpdate.userId === userId) {
            const updates = postToUpdate;
            for (const [key, value] of Object.entries(req.body)) {
                if (key !== "likes" && key !== "userId") {
                    updates[key] = value;
                }
            }
            await PostRepository_1.default.updatePost(updates);
            res.status(200).json({ message: "the post has been updated" });
        }
        else {
            res.status(403).json({ message: "you can update only your post" });
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
};
exports.updatePost = updatePost;
//delete a post
const deletePost = async (req, res) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo)
            return res.status(404).json({ message: "currentUser not found." });
        const currentUser = await userRepository_1.default.getUserByPseudo(pseudo);
        if (!currentUser)
            return res.status(404).json({ message: "currentUser not found." });
        const postToDelete = await PostRepository_1.default.getPostById(req.body.postId);
        if (!postToDelete || !postToDelete.postId)
            return res.status(404).json({ message: "Post not found." });
        if (postToDelete.userId === currentUser.pseudo || currentUser.isAdmin) {
            await PostRepository_1.default.deletePost(postToDelete.postId);
            res.status(200).json({ message: "the post has been deleted" });
        }
        else {
            return res.status(403).json({ message: "you can delete only your post" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};
exports.deletePost = deletePost;
// like/dislike a post
const likePost = async (req, res) => {
    const userId = req.user?.pseudo;
    if (!userId)
        return res.status(404).json({ message: "currentUser not found." });
    try {
        const postToLike = await PostRepository_1.default.getPostById(req.body._id);
        if (!postToLike || !postToLike.postId)
            return res.status(404).json({ message: "Post not found." });
        if (!postToLike.likes?.includes(userId)) {
            await PostRepository_1.default.likePost(postToLike.postId, userId);
            res.status(200).json("The post has been liked");
        }
        else {
            await PostRepository_1.default.unlikePost(postToLike.postId, userId);
            res.status(200).json("The post has been disliked");
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};
exports.likePost = likePost;
