import { Request } from 'express';

import { IPostIdReturn, IPostReturn, IPostIdPostAndUserIdReturn } from './_interfaces';
import { CheckIfCurrentUserExist } from './userValidations';
import PostRepository from '../../dal/repositories/PostRepository';

export const CheckCreatePost = async (req: Request): Promise<IPostReturn> => {
    const { message, selectedFile, tags } = req.body;
    const currentUser = (await CheckIfCurrentUserExist(req)).user;

    return { status: 200, message: "les données renseignées sont valides", post: { userId: currentUser.pseudo, message, selectedFile, tags } };
};

export const CheckUpdatePost = async (req: Request): Promise<IPostReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    
    try {
        const postToUpdate = await PostRepository.getPostById(req.body._id);

        if (!postToUpdate) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost };
        }

        if (postToUpdate.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez modifier que vos posts.", post: emptyPost };
        }

        return { status: 200, message: "les données renseignées sont valides", post: postToUpdate };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost };
    }
};

export const CheckDeletePost = async (req: Request): Promise<IPostIdReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const postId = req.body.postId;

    try {
        const postToDelete = await PostRepository.getPostById(postId);

        if (!postToDelete || !postToDelete.postId) {
            return { status: 404, message: "Post non trouvé.", postId: "" };
        }

        if (postToDelete.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez supprimer que vos posts.", postId: "" };
        }

        return { status: 200, message: "les données renseignées sont valides", postId: postId };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", postId: "" };
    }
};

export const CheckLikePost = async (req: Request): Promise<IPostIdPostAndUserIdReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const postId = req.body.postId;
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };

    try {
        const postToLike = await PostRepository.getPostById(postId);

        if (!postToLike || !postToLike.postId) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost, userId: "", postId: "" };
        }

        return { status: 200, message: "les données renseignées sont valides", post: postToLike, userId: currentUser.pseudo, postId: postId };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost, userId: "", postId: "" };
    }
};
