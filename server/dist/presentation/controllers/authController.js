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
//REGISTER
const registerUser = async (req, res) => {
    const registerResult = await (0, authValidations_1.CheckRegisterUser)(req);
    const user = registerResult.user;
    if (registerResult.status !== 200) {
        return res.status(registerResult.status).json({ message: registerResult.message });
    }
    try {
        // Generate new password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(user.password, salt);
        const result = await userRepository_1.default.createUser({ pseudo: user.pseudo, email: user.email, password: hashedPassword, username: `${user.firstName} ${user.lastName}` });
        const token = jsonwebtoken_1.default.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Access-Control-Allow-Credentials', 'true');
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
//LOGIN
const loginUser = async (req, res) => {
    const loginResult = await (0, authValidations_1.CheckLoginUser)(req);
    const user = loginResult.user;
    if (loginResult.status !== 200) {
        return res.status(loginResult.status).json({ message: loginResult.message });
    }
    try {
        const token = jsonwebtoken_1.default.sign({ pseudo: user.pseudo, email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Access-Control-Allow-Credentials', 'true');
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
// CHECK AUTH
const checkAuth = async (req, res) => {
    res.status(200).json({ userId: req.user?.pseudo, message: 'Nous avons vérifié, l\'utilisateur est bien connecté.' });
};
exports.checkAuth = checkAuth;
// LOGOUT
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('Authorization');
        res.status(200).json({ message: 'Vous êtes correctement déconnecté.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la déconnexion.' });
    }
};
exports.logoutUser = logoutUser;
