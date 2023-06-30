import { Request, Response } from "express";

import PostRepository from "./../repositories/PostRepository";
import { CheckCreatePost, CheckDeletePost, CheckGetFriendsPosts, CheckGetPost, CheckGetUserPosts, CheckLikePost, CheckUpdatePost } from "./validations/postValidations";
import { IPost } from "./../models/_interfaces/PostsInterfaces";

/**
 * Fonction pour obtenir tous les posts
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getPosts = async (req: Request, res: Response) => {
    try {
        // Récupération de tous les posts
        const posts = await PostRepository.getPosts();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve all post." });
    }
};

/**
 * Fonction pour obtenir un post par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getPost = async (req: Request, res: Response) => {

    // Vérification des données de récupération du post
    const CheckGetPostResult = await CheckGetPost(req);

    // Récupération du post
    const post = CheckGetPostResult.post;

    if (CheckGetPostResult.status !== 200) {
        return res.status(CheckGetPostResult.status).json({ message: CheckGetPostResult.message });
    }
    
    res.status(200).json(post);
};

/**
 * Fonction pour obtenir tous les posts d'un utilisateur par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getUserPosts = async (req: Request, res: Response) => {

    // Vérification des données de récupération des posts de l'utilisateur
    const CheckGetUserPostsResult = await CheckGetUserPosts(req);

    // Récupération des posts de l'utilisateur
    const posts = CheckGetUserPostsResult.posts;

    if (CheckGetUserPostsResult.status !== 200) {
        return res.status(CheckGetUserPostsResult.status).json({ message: CheckGetUserPostsResult.message });
    }

    res.status(200).json(posts);
};

/**
 * Fonction pour obtenir tous les posts d'un utilisateur et de ses amis par son id
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const getFriendsPosts = async (req: Request, res: Response) => {

    // Vérification des données de récupération des posts de l'utilisateur et de ses amis
    const CheckGetFriendsPostsResult = await CheckGetFriendsPosts(req);

    // Récupération des posts de l'utilisateur et de ses amis
    const posts = CheckGetFriendsPostsResult.posts;
    
    res.status(200).json(posts);
};

/**
 * Fonction pour créer un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const createPost = async (req: Request, res: Response) => {

    // Verification des données de création du post
    const checkCreateResult = await CheckCreatePost(req);

    // Récupération du post
    const post = checkCreateResult.post;

    if (checkCreateResult.status !== 200) {
        return res.status(checkCreateResult.status).json({message: checkCreateResult.message});
    }

    try {
        // Création du post
        const newPost = await PostRepository.createPost({ userId: post.userId, message: post.message, selectedFile: post.selectedFile, tags: post.tags });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: "Error during post creation."});
    }
};

/**
 * Fonction pour modifier un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const updatePost = async (req: Request, res: Response) => {

    // Vérification des données de modification du post
    const CheckUpdatePostResult = await CheckUpdatePost(req);

    // Récupération du post
    const post = CheckUpdatePostResult.post;

    if (CheckUpdatePostResult.status !== 200) {
        return res.status(CheckUpdatePostResult.status).json({message: CheckUpdatePostResult.message});
    }

    try {
        // Création de l'objet de mise à jour
        const updates: IPost = post;

        // Parcours des données à modifier
        for (const [key, value] of Object.entries(req.body)) {

            // Exclusion des données à ne pas modifier
            if (key !== "likes" && key !== "userId") {
                (updates as any)[key] = value;
            }
        }

        // Mise à jour du post
        await PostRepository.updatePost(updates);
        res.status(200).json({message: "the post has been updated"});
    } catch (err) {
        return res.status(500).json({message: "Error during post update."});
    }
};

/**
 * Fonction pour supprimer un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const deletePost = async (req: Request, res: Response) => {

    // Vérification des données de suppression du post
    const CheckDeletePostResult = await CheckDeletePost(req);

    // Récupération de l'id du post
    const postId = CheckDeletePostResult.postId;

    if (CheckDeletePostResult.status !== 200) {
        return res.status(CheckDeletePostResult.status).json({message: CheckDeletePostResult.message});
    }

    try {
        // Suppression du post
        await PostRepository.deletePost(postId);
        res.status(200).json({message: "the post has been deleted"});
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};

/**
 * Fonction pour liker ou disliker un post
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const likePost = async (req: Request, res: Response) => {

    // Vérification des données de like ou dislike du post
    const CheckLikePostResult = await CheckLikePost(req);

    // Récupération du post, de l'id du post et de l'id de l'utilisateur
    const post = CheckLikePostResult.post;
    const postId = CheckLikePostResult.postId;
    const userId = CheckLikePostResult.userId;

    if (CheckLikePostResult.status !== 200) {
        return res.status(CheckLikePostResult.status).json({message: CheckLikePostResult.message});
    }

    try {
        // Si l'utilisateur n'a pas déjà liké le post, il le like, sinon il le dislike
        if (!post.likes?.includes(userId)) {

            // Like du post
            await PostRepository.likePost(postId, userId);
            res.status(200).json("The post has been liked");
        } else {

            // Dislike du post
            await PostRepository.unlikePost(postId, userId);
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};