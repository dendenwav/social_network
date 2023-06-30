import { Request } from 'express';

import { IPostIdReturn, IPostReturn, IPostIdPostAndUserIdReturn, IPostsReturn } from './_interfaces';
import { CheckIfCurrentUserExist } from './userValidations';
import PostRepository from '../../repositories/PostRepository';
import UserRepository from '../../repositories/userRepository';

/**
 * Fonction pour vérifier les données de récupération d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
export const CheckGetPost = async (req: Request): Promise<IPostReturn> => {

    // Récupération de l'id du post
    const postId = req.params.postId;

    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };
    
    // Essaie de récupérer le post
    const post = await PostRepository.getPostById(postId);
    
    // Vérifie si le post est trouvé
    if (!post) {
        return { status: 404, message: "Post non trouvé.", post: emptyPost };
    }
    
    return { status: 200, message: "les données renseignées sont valides", post: post };
};

/**
 * Fonction pour vérifier les données de récupeation des posts d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les posts
 */
export const CheckGetUserPosts = async (req: Request): Promise<IPostsReturn> => {

    // Récupération de l'id de l'utilisateur
    const pseudo = req.params.userId;

    try {
        // Essaie de récupérer l'utilisateur
        const user = await UserRepository.getUserByPseudo(pseudo);

        // Vérifie si l'utilisateur est trouvé
        if (!user) {
            return { status: 404, message: "Utilisateur non trouvé.", posts: [] };
        }

        // Essaie de récupérer les posts de l'utilisateur
        const posts = await PostRepository.getUserPosts(user.pseudo);

        // Vérifie si les posts sont trouvés
        if (!posts) {
            return { status: 404, message: "Aucun post trouvé.", posts: [] };
        }

        return { status: 200, message: "les données renseignées sont valides", posts: posts };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération des posts.", posts: [] };
    }
};

/**
 * Fonction pour vérifier les données de récupération des posts d'un utilisateur et de ses amis
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et les posts
 */
export const CheckGetFriendsPosts = async (req: Request): Promise<IPostsReturn> => {

    // Récupération du pseudo de l'utilisateur
    const pseudo = req.params.userId;
    try {
        // Essaie de récupérer l'utilisateur
        const user = await UserRepository.getUserByPseudo(pseudo);

        // Vérifie si l'utilisateur est trouvé
        if (!user) {
            return { status: 404, message: "Utilisateur non trouvé.", posts: [] };
        }

        // Essaie de récupérer les posts de l'utilisateur
        const userPosts = await PostRepository.getUserPosts(user.pseudo);

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
        const friendPosts = await Promise.all(
            user.followings.map((friendId) => {
                const friendPosts = PostRepository.getUserPosts(friendId);

                // Vérifie si les posts de chaque ami sont trouvés
                if (!friendPosts) erreur = true;

                return friendPosts;
            })
        );

        // Vérifie si une erreur est survenue ou si les posts des amis sont trouvés
        if (!friendPosts || erreur) {
            return { status: 404, message: "Aucun post trouvé.", posts: [] };
        }

        return { status: 200, message: "les données renseignées sont valides", posts: userPosts.concat(...friendPosts) };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération des posts.", posts: [] };
    }
};

/**
 * Fonction pour vérifier les données de création d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
export const CheckCreatePost = async (req: Request): Promise<IPostReturn> => {

    // Récupération des données du post
    const { message, selectedFile, tags } = req.body;

    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };

    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await CheckIfCurrentUserExist(req);

    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;

    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, post: emptyPost };
    }

    return { status: 200, message: "les données renseignées sont valides", post: { userId: currentUser.pseudo, message, selectedFile, tags } };
};

/**
 * Fonction pour vérifier les données de modification d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et le post
 */
export const CheckUpdatePost = async (req: Request): Promise<IPostReturn> => {
    
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await CheckIfCurrentUserExist(req);

    // Création d'un post vide
    const emptyPost = { userId: "", message: "", selectedFile: "", tags: [] };

    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;

    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, post: emptyPost };
    }    
    
    try {
        // Essaie de récupérer le post à modifier
        const postToUpdate = await PostRepository.getPostById(req.body._id);

        // Vérifie si le post est trouvé
        if (!postToUpdate) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost };
        }

        // Vérifie si l'utilisateur courant est l'auteur du post ou s'il est admin
        if (postToUpdate.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez modifier que vos posts.", post: emptyPost };
        }

        return { status: 200, message: "les données renseignées sont valides", post: postToUpdate };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost };
    }
};

/**
 * Fonction pour vérifier les données de suppression d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'id du post
 */
export const CheckDeletePost = async (req: Request): Promise<IPostIdReturn> => {
    
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await CheckIfCurrentUserExist(req);

    // Récupération de l'id du post
    const postId = req.body.postId;

    // Récupération de l'utilisateur courant
    const currentUser = CheckIfCurrentUserExistResult.user;

    if (CheckIfCurrentUserExistResult.status !== 200) {
        return { status: CheckIfCurrentUserExistResult.status, message: CheckIfCurrentUserExistResult.message, postId: "" };
    }

    try {
        // Essaie de récupérer le post à supprimer
        const postToDelete = await PostRepository.getPostById(postId);

        // Vérifie si le post est trouvé
        if (!postToDelete || !postToDelete.postId) {
            return { status: 404, message: "Post non trouvé.", postId: "" };
        }

        // Vérifie si l'utilisateur courant est l'auteur du post ou s'il est admin
        if (postToDelete.userId !== currentUser.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez supprimer que vos posts.", postId: "" };
        }

        return { status: 200, message: "les données renseignées sont valides", postId: postId };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", postId: "" };
    }
};

/**
 * Fonction pour vérifier les données de like d'un post
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message, l'id du post, le post et l'id de l'utilisateur
 */
export const CheckLikePost = async (req: Request): Promise<IPostIdPostAndUserIdReturn> => {
    
    // Vérifie si les données de l'utilisateur courant sont valides
    const CheckIfCurrentUserExistResult = await CheckIfCurrentUserExist(req);

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
        const postToLike = await PostRepository.getPostById(postId);

        // Vérifie si le post est trouvé
        if (!postToLike || !postToLike.postId) {
            return { status: 404, message: "Post non trouvé.", post: emptyPost, userId: "", postId: "" };
        }

        return { status: 200, message: "les données renseignées sont valides", post: postToLike, userId: currentUser.pseudo, postId: postId };
    } catch (err) {
        return { status: 500, message: "Erreur lors de la récupération du post.", post: emptyPost, userId: "", postId: "" };
    }
};
