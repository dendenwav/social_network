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
    const checkCreateResult = await (0, postValidations_1.CheckCreatePost)(req);
    const post = checkCreateResult.post;
    if (checkCreateResult.status !== 200) {
        return res.status(checkCreateResult.status).json({ message: checkCreateResult.message });
    }
    try {
        const newPost = await PostRepository_1.default.createPost({ userId: post.userId, message: post.message, selectedFile: post.selectedFile, tags: post.tags });
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: "Error during post creation." });
    }
};
exports.createPost = createPost;
//update a post
const updatePost = async (req, res) => {
    const CheckUpdatePostResult = await (0, postValidations_1.CheckUpdatePost)(req);
    const post = CheckUpdatePostResult.post;
    if (CheckUpdatePostResult.status !== 200) {
        return res.status(CheckUpdatePostResult.status).json({ message: CheckUpdatePostResult.message });
    }
    try {
        const updates = post;
        for (const [key, value] of Object.entries(req.body)) {
            if (key !== "likes" && key !== "userId") {
                updates[key] = value;
            }
        }
        await PostRepository_1.default.updatePost(updates);
        res.status(200).json({ message: "the post has been updated" });
    }
    catch (err) {
        return res.status(500).json({ message: "Error during post update." });
    }
};
exports.updatePost = updatePost;
//delete a post
const deletePost = async (req, res) => {
    const CheckDeletePostResult = await (0, postValidations_1.CheckDeletePost)(req);
    const postId = CheckDeletePostResult.postId;
    if (CheckDeletePostResult.status !== 200) {
        return res.status(CheckDeletePostResult.status).json({ message: CheckDeletePostResult.message });
    }
    try {
        await PostRepository_1.default.deletePost(postId);
        res.status(200).json({ message: "the post has been deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};
exports.deletePost = deletePost;
// like/dislike a post
const likePost = async (req, res) => {
    const CheckLikePostResult = await (0, postValidations_1.CheckLikePost)(req);
    const post = CheckLikePostResult.post;
    const postId = CheckLikePostResult.postId;
    const userId = CheckLikePostResult.userId;
    if (CheckLikePostResult.status !== 200) {
        return res.status(CheckLikePostResult.status).json({ message: CheckLikePostResult.message });
    }
    try {
        if (!post.likes?.includes(userId)) {
            await PostRepository_1.default.likePost(postId, userId);
            res.status(200).json("The post has been liked");
        }
        else {
            await PostRepository_1.default.unlikePost(postId, userId);
            res.status(200).json("The post has been disliked");
        }
    }
    catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};
exports.likePost = likePost;
