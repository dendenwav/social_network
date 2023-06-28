import { Request } from 'express';
import { ICurrentUserReturn, IPostReturn } from './_interfaces';

export const CheckIfCurrentUserExist = (req: Request): ICurrentUserReturn => {
    const pseudo = req.user?.pseudo;
    const emptyPseudo = "";

    if (!pseudo) {
        return { status: 401, message: "Vous n'êtes pas connecté.", pseudo: emptyPseudo };
    }

    return { status: 200, message: "Vous êtes connecté.", pseudo: pseudo };
};

export const CheckCreatePost = (req: Request): IPostReturn => {
    const { message, selectedFile, tags } = req.body;
    const userId = CheckIfCurrentUserExist(req).pseudo;
    return { status: 200, message: "Post créé.", post: { userId, message, selectedFile, tags } };
};