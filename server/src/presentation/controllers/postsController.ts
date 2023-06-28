import { Request, Response } from "express";

import PostRepository from "../../dal/repositories/PostRepository";
import UserRepository from "../../dal/repositories/userRepository";
import { CheckIfCurrentUserExist } from "../validations/postValidations";
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
    const { message, selectedFile, tags } = req.body;
    const currentUserResult = CheckIfCurrentUserExist(req);

    if (currentUserResult.status !== 200) {
        return res.status(currentUserResult.status).json(currentUserResult.message);
    }

    try {
        const newPost = await PostRepository.createPost({ userId: currentUserResult.pseudo, message, selectedFile, tags });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: "Error during post creation."});
    }
};

//update a post
export const updatePost = async (req: Request, res: Response) => {
    const userId = req.user?.pseudo;
    try {
        const postToUpdate = await PostRepository.getPostById(req.body._id);

        if (!postToUpdate) return res.status(404).json({ message: "Post not found." });

        if (postToUpdate.userId === userId) {

            const updates: IPost = postToUpdate;

            for (const [key, value] of Object.entries(req.body)) {
                if (key !== "likes" && key !== "userId") {
                    (updates as any)[key] = value;
                }
            }

            await PostRepository.updatePost(updates);
            res.status(200).json({message: "the post has been updated"});
        } else {
            res.status(403).json({message: "you can update only your post"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

//delete a post
export const deletePost = async (req: Request, res: Response) => {
    const pseudo = req.user?.pseudo;
    try {
        if (!pseudo) return res.status(404).json({ message: "currentUser not found." });

        const currentUser = await UserRepository.getUserByPseudo(pseudo);

        if (!currentUser) return res.status(404).json({ message: "currentUser not found." });

        const postToDelete = await PostRepository.getPostById(req.body.postId);

        if (!postToDelete || !postToDelete.postId) return res.status(404).json({ message: "Post not found." });

        if (postToDelete.userId === currentUser.pseudo || currentUser.isAdmin) {
            await PostRepository.deletePost(postToDelete.postId);
            res.status(200).json({message: "the post has been deleted"});
        } else {
            return res.status(403).json({message: "you can delete only your post"});
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};

// like/dislike a post
export const likePost = async (req: Request, res: Response) => {
    const userId = req.user?.pseudo;
    
    if (!userId) return res.status(404).json({ message: "currentUser not found." });

    try {
        const postToLike = await PostRepository.getPostById(req.body._id);

        if (!postToLike || !postToLike.postId) return res.status(404).json({ message: "Post not found." });

        if (!postToLike.likes?.includes(userId)) {
            await PostRepository.likePost(postToLike.postId, userId);
            res.status(200).json("The post has been liked");
        } else {
            await PostRepository.unlikePost(postToLike.postId, userId);
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};
