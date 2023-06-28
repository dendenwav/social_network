"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCreatePost = exports.CheckIfCurrentUserExist = void 0;
const CheckIfCurrentUserExist = (req) => {
    const pseudo = req.user?.pseudo;
    const emptyPseudo = "";
    if (!pseudo) {
        return { status: 401, message: "Vous n'êtes pas connecté.", pseudo: emptyPseudo };
    }
    return { status: 200, message: "Vous êtes connecté.", pseudo: pseudo };
};
exports.CheckIfCurrentUserExist = CheckIfCurrentUserExist;
const CheckCreatePost = (req) => {
    const { message, selectedFile, tags } = req.body;
    const userId = (0, exports.CheckIfCurrentUserExist)(req).pseudo;
    return { status: 200, message: "Post créé.", post: { userId, message, selectedFile, tags } };
};
exports.CheckCreatePost = CheckCreatePost;
