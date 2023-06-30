"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.checkAuth = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository_1 = __importDefault(require("../../dal/repositories/userRepository"));
const authValidations_1 = require("../validations/authValidations");
/**
 * Fonction pour l'inscription d'un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const registerUser = async (req, res) => {
    // Vérification des données d'inscription de l'utilisateur
    const registerResult = await (0, authValidations_1.CheckRegisterUser)(req);
    const user = registerResult.user;
    if (registerResult.status !== 200) {
        return res.status(registerResult.status).json({ message: registerResult.message });
    }
    try {
        // Génération d'un nouveau mot de passe crypté
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(user.password, salt);
        // Création d'un nouvel utilisateur dans la base de données
        const result = await userRepository_1.default.createUser({ pseudo: user.pseudo, email: user.email, password: hashedPassword, username: `${user.firstName} ${user.lastName}` });
        // Génération un jeton d'authentification pour l'utilisateur
        const token = jsonwebtoken_1.default.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Définition des en-têtes de la réponse
        res.header('Access-Control-Allow-Credentials', 'true');
        // Définition du cookie d'authentification avec le jeton d'authentification
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        });
        res.status(200).json({ userId: result.pseudo, message: 'Vous êtes correctement inscrit.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur est survenue lors de la création de votre compte." });
    }
};
exports.registerUser = registerUser;
/**
 * Fonction pour la connexion d'un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const loginUser = async (req, res) => {
    // Vérification des données de connexion de l'utilisateur
    const loginResult = await (0, authValidations_1.CheckLoginUser)(req);
    const user = loginResult.user;
    if (loginResult.status !== 200) {
        return res.status(loginResult.status).json({ message: loginResult.message });
    }
    try {
        // Génération d'un jeton d'authentification pour l'utilisateur
        const token = jsonwebtoken_1.default.sign({ pseudo: user.pseudo, email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Définition des en-têtes de la réponse
        res.header('Access-Control-Allow-Credentials', 'true');
        // Définition du cookie d'authentification avec le jeton d'authentification
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        });
        res.status(200).json({ userId: user.pseudo, message: 'Vous êtes correctement connecté.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
};
exports.loginUser = loginUser;
/**
 * Fonction pour vérifier l'authentification de l'utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const checkAuth = async (req, res) => {
    res.status(200).json({ userId: req.user?.pseudo, message: 'Nous avons vérifié, l\'utilisateur est bien connecté.' });
};
exports.checkAuth = checkAuth;
/**
 * Fonction pour la déconnexion de l'utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
const logoutUser = async (req, res) => {
    try {
        // Suppression du cookie d'authentification
        res.clearCookie('Authorization');
        res.status(200).json({ message: 'Vous êtes correctement déconnecté.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la déconnexion.' });
    }
};
exports.logoutUser = logoutUser;
