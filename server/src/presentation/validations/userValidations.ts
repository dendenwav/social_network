import { Request } from 'express';

import UserRepository from "../../dal/repositories/userRepository";
import { IPseudoReturn, IPseudosForFollowReturn, IUserReturn } from "./_interfaces";

export const CheckIfCurrentUserExist = async (req: Request): Promise<IUserReturn> => {
    const pseudo = req.user?.pseudo;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };

    if (!pseudo) {
        return { status: 401, message: "Vous n'êtes pas connecté.", user: emptyUser };
    }    

    const currentUser = await UserRepository.getUserByPseudo(pseudo);

    if (!currentUser) {
        return { status: 401, message: "L'utilisateur est inconnue.", user: emptyUser };
    }

    return { status: 200, message: "Vous êtes connecté.", user: currentUser };
};

export const CheckGetUser = async (req: Request): Promise<IUserReturn> => {
    const pseudo = req.params.id;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };

    try {
        const user = await UserRepository.getUserByPseudo(pseudo, { email: 0, password: 0, updatedAt: 0 });

        if  (!user) {
            return { status: 404, message: "L'utilisateur est inconnue.", user: emptyUser };
        }
        return { status: 200, message: "L'utilisateur est connue.", user: user}
    } catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", user: emptyUser };
    }
};

export const CheckUpdateUser = async (req: Request): Promise<IUserReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const emptyUser = { pseudo: "", email: "", password: "", isAdmin: false };

    try {
        const userToUpdate = await UserRepository.getUserByPseudo(req.body.userId);

        if (!userToUpdate) {
            return { status: 404, message: "L'utilisateur est inconnue.", user: emptyUser };
        }

        if (currentUser.pseudo !== userToUpdate.pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez modifier que votre propre compte.", user: emptyUser };
        }
        
        return { status: 200, message: "L'utilisateur a été correctement récupéré.", user: userToUpdate}
    } catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", user: emptyUser };
    }
};

export const CheckDeleteUser = async (req: Request): Promise<IPseudoReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const pseudo = req.params.id;

    try {
        const userToDelete = await UserRepository.getUserByPseudo(pseudo);
    
        if (!userToDelete) {
            return { status: 404, message: "L'utilisateur est inconnue.", pseudo: "" };
        }

        if (currentUser.pseudo !== pseudo || !currentUser.isAdmin) {
            return { status: 403, message: "Vous ne pouvez supprimer que votre propre compte.", pseudo: "" };
        }

        return { status: 200, message: "L'utilisateur a été correctement récupéré.", pseudo: pseudo}
    } catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", pseudo: "" };
    }
};

export const CheckFollowUser = async (req: Request): Promise<IPseudosForFollowReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const pseudo = req.params.id;

    try {   

        const userToFollow = await UserRepository.getUserByPseudo(pseudo);
    
        if (!userToFollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }

        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: ""  };
        }

        if (!currentUser.followings || !userToFollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }

        if (currentUser.followings.includes(pseudo as string) && userToFollow.followers.includes(currentUser.pseudo as string)) {
            return { status: 403, message: "Vous suivez déjà cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }

        if (!currentUser.followings.includes(pseudo as string) && userToFollow.followers.includes(currentUser.pseudo as string)
        || currentUser.followings.includes(pseudo as string) && !userToFollow.followers.includes(currentUser.pseudo as string)) {            
            await UserRepository.unfollowUser(currentUser.pseudo, pseudo);
            return { status: 403, message: "Une incohérence a été détectée. Par défaut, l'utilisateur a été désuivi.", currentPseudo: "", userToFollowPseudo: "" };
        }

        return { status: 200, message: "L'utilisateur a été correctement récupéré.", currentPseudo: currentUser.pseudo, userToFollowPseudo: pseudo}
    } catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
    }
};

export const CheckUnfollowUser = async (req: Request): Promise<IPseudosForFollowReturn> => {
    const currentUser = (await CheckIfCurrentUserExist(req)).user;
    const pseudo = req.params.id;

    try {
        const userToUnfollow = await UserRepository.getUserByPseudo(pseudo);
    
        if (!userToUnfollow) {
            return { status: 404, message: "L'utilisateur est inconnue.", currentPseudo: "", userToFollowPseudo: "" };
        }
        
        if (currentUser.pseudo === pseudo) {
            return { status: 403, message: "Vous ne pouvez pas ne plus vous suivre vous-même.", currentPseudo: "", userToFollowPseudo: ""  };
        }

        if (!currentUser.followings || !userToUnfollow.followers) {
            return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }

        if (!currentUser.followings.includes(pseudo as string) && !userToUnfollow.followers.includes(currentUser.pseudo as string)) {
            return { status: 403, message: "Vous ne suivez pas cet utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
        }

        if (!currentUser.followings.includes(pseudo as string) && userToUnfollow.followers.includes(currentUser.pseudo as string)
        || currentUser.followings.includes(pseudo as string) && !userToUnfollow.followers.includes(currentUser.pseudo as string)) {            
            await UserRepository.unfollowUser(currentUser.pseudo, pseudo);
            return { status: 403, message: "Une incohérence a été détectée. Par défaut, l'utilisateur a été désuivi.", currentPseudo: "", userToFollowPseudo: "" };
        }

        return { status: 200, message: "L'utilisateur a été correctement récupéré.", currentPseudo: currentUser.pseudo, userToFollowPseudo: pseudo}
    } catch (err) {
        console.error(err);
        return { status: 500, message: "Erreur lors de la récupération de l'utilisateur.", currentPseudo: "", userToFollowPseudo: "" };
    }
};