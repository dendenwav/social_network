"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    if (!req.cookies || !req.cookies.Authorization) {
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ip);
    const token = req.cookies.Authorization;
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, id: decodedToken.id };
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }
};
exports.default = auth;
