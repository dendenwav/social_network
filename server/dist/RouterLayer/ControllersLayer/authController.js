"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.checkAuth = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
//REGISTER
const registerUser = async (req, res) => {
    console.log(req.body);
    const { pseudo, email, password, confirmPassword, firstName, lastName } = req.body;
    // Input validation
    if (!pseudo || !email || !password || !confirmPassword || !firstName || !lastName) {
        console.log('Please enter all required fields');
        return res.status(400).json({ message: 'Veuillez renseigner tous les champs nécéssaires.' });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log('Please enter a valid email');
        return res.status(400).json({ message: 'Veuillez renseigner un email valide.' });
    }
    if (password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }
    try {
        const existingPseudo = await UserModel_1.default.findOne({ pseudo });
        const existingEmail = await UserModel_1.default.findOne({ email });
        if (existingPseudo && existingEmail) {
            console.log('An account with this pseudonym and email already exists');
            return res.status(400).json({ message: 'Un compte avec ce pseudo et cet email existe déjà.' });
        }
        else if (existingPseudo) {
            console.log('An account with this pseudonym already exists');
            return res.status(400).json({ message: 'Un compte avec ce pseudo existe déjà.' });
        }
        else if (existingEmail) {
            console.log('An account with this email already exists');
            return res.status(400).json({ message: 'Un compte avec cet email existe déjà.' });
        }
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({ message: 'les mots de passe doivent être identiques.' });
        }
        // Generate new password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const result = await UserModel_1.default.create({ pseudo, email, password: hashedPassword, username: `${firstName} ${lastName}` });
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
    console.log(req.body);
    const { userId, password } = req.body;
    try {
        if (!userId || !password) {
            console.log('Identifier and password are required.');
            return res.status(400).json({ message: 'L\'identifiant et le mot de passe sont requis.' });
        }
        if (password.length < 8) {
            console.log('Password must be at least 8 characters long.');
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
        }
        var existingUser = await UserModel_1.default.findOne({ pseudo: userId });
        if (!existingUser) {
            existingUser = await UserModel_1.default.findOne({ email: userId });
        }
        if (!existingUser) {
            console.log('Incorrect email or pseudo.');
            return res.status(404).json({ message: 'L\'email ou le pseudo n\'est pas reconnue' });
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log('Incorrect password.');
            return res.status(401).json({ message: 'Le mot de passe ne correspond pas.' });
        }
        const token = jsonwebtoken_1.default.sign({ pseudo: existingUser.pseudo, email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Access-Control-Allow-Credentials', 'true');
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        });
        res.status(200).json({ userId: existingUser.pseudo, message: 'Vous êtes correctement connecté.' });
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
