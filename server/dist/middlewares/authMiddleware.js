"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    if (!req.cookies) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }
    const token = req.cookies.Authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, id: decodedToken.id };
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};
exports.default = auth;
