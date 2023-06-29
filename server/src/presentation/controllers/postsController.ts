import { Request, Response } from "express";

import PostRepository from "../../dal/repositories/PostRepository";
import UserRepository from "../../dal/repositories/userRepository";
import { CheckCreatePost, CheckDeletePost, CheckLikePost, CheckUpdatePost } from "../validations/postValidations";
import { IPost } from "../../models/_interfaces/PostsInterfaces";

//get all posts
export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostRepository.getPosts();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve all post." });
    }
};

//get a post
export const getPost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const post = await PostRepository.getPostById(postId);
        
        if (!post) return res.status(404).json({ error: "Post not found." });
        
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve post." });
    }
};

//get user's posts
export const getUserPosts = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const user = await UserRepository.getUserByPseudo(userId);

        if (!user) return res.status(404).json({ error: "User not found." });

        const posts = await PostRepository.getUserPosts(user.pseudo);
        
        if (!posts) return res.status(404).json({ error: "User's posts not found." });

        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's posts." });
    }
};

//get all posts from user and followings
export const getFriendsPosts = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const user = await UserRepository.getUserByPseudo(userId);

        if (!user) return res.status(404).json({ error: "User not found." });

        const userPosts = await PostRepository.getUserPosts(user.pseudo);

        if (!userPosts) return res.status(404).json({ error: "User's posts not found." });

        if (!user.followings) return res.status(404).json({ error: "User's followings not found." });

        const friendPosts = await Promise.all(
            user.followings.map((friendId) => {
                return PostRepository.getUserPosts(friendId);
            })
        );

        if (!friendPosts) return res.status(404).json({ error: "User's friends posts not found." });

        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's friends posts." });
    }
};

//create a post
export const createPost = async (req: Request, res: Response) => {
    const checkCreateResult = await CheckCreatePost(req);
    const post = checkCreateResult.post;

    if (checkCreateResult.status !== 200) {
        return res.status(checkCreateResult.status).json({message: checkCreateResult.message});
    }

    try {
        const newPost = await PostRepository.createPost({ userId: post.userId, message: post.message, selectedFile: post.selectedFile, tags: post.tags });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: "Error during post creation."});
    }
};

//update a post
export const updatePost = async (req: Request, res: Response) => {
    const CheckUpdatePostResult = await CheckUpdatePost(req);
    const post = CheckUpdatePostResult.post;

    if (CheckUpdatePostResult.status !== 200) {
        return res.status(CheckUpdatePostResult.status).json({message: CheckUpdatePostResult.message});
    }

    try {
        const updates: IPost = post;

        for (const [key, value] of Object.entries(req.body)) {
            if (key !== "likes" && key !== "userId") {
                (updates as any)[key] = value;
            }
        }

        await PostRepository.updatePost(updates);
        res.status(200).json({message: "the post has been updated"});
    } catch (err) {
        return res.status(500).json({message: "Error during post update."});
    }
};

//delete a post
export const deletePost = async (req: Request, res: Response) => {
    const CheckDeletePostResult = await CheckDeletePost(req);
    const postId = CheckDeletePostResult.postId;

    if (CheckDeletePostResult.status !== 200) {
        return res.status(CheckDeletePostResult.status).json({message: CheckDeletePostResult.message});
    }

    try {
        await PostRepository.deletePost(postId);
        res.status(200).json({message: "the post has been deleted"});
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};

// like/dislike a post
export const likePost = async (req: Request, res: Response) => {
    const CheckLikePostResult = await CheckLikePost(req);
    const post = CheckLikePostResult.post;
    const postId = CheckLikePostResult.postId;
    const userId = CheckLikePostResult.userId;

    if (CheckLikePostResult.status !== 200) {
        return res.status(CheckLikePostResult.status).json({message: CheckLikePostResult.message});
    }

    try {
        if (!post.likes?.includes(userId)) {
            await PostRepository.likePost(postId, userId);
            res.status(200).json("The post has been liked");
        } else {
            await PostRepository.unlikePost(postId, userId);
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};
