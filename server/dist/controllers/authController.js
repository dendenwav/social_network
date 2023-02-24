"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
//REGISTER
const registerUser = async (req, res) => {
    console.log(req.body);
    const { pseudo, email, password, confirmPassword, firstName, lastName } = req.body;
    // Input validation
    if (!pseudo || !email || !password || !confirmPassword || !firstName || !lastName) {
        console.log('Please enter all required fields');
        return res.status(400).json({ message: 'Please enter all required fields' });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log('Please enter a valid email');
        return res.status(400).json({ message: 'Please enter a valid email' });
    }
    if (password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    try {
        const existingPseudo = await UserModel_1.default.findOne({ pseudo });
        const existingEmail = await UserModel_1.default.findOne({ email });
        if (existingPseudo && existingEmail) {
            console.log('An account with this pseudonym and email already exists');
            return res.status(400).json({ message: 'An account with this pseudonym and email already exists' });
        }
        else if (existingPseudo) {
            console.log('An account with this pseudonym already exists');
            return res.status(400).json({ message: 'An account with this pseudonym already exists' });
        }
        else if (existingEmail) {
            console.log('An account with this email already exists');
            return res.status(400).json({ message: 'An account with this email already exists' });
        }
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({ message: 'Passwords do not match' });
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
        res.status(200).json({ message: `User registered successfully for ${result.pseudo}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
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
            return res.status(400).json({ message: 'Identifier and password are required.' });
        }
        if (password.length < 8) {
            console.log('Password must be at least 8 characters long.');
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        var existingUser = await UserModel_1.default.findOne({ pseudo: userId });
        if (!existingUser) {
            existingUser = await UserModel_1.default.findOne({ email: userId });
        }
        if (!existingUser) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.' });
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log('Incorrect email or password.');
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ pseudo: existingUser.pseudo, email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Access-Control-Allow-Credentials', 'true');
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        });
        res.status(200).json({ message: `Login successful for ${existingUser.pseudo}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
};
exports.loginUser = loginUser;
// CHECK AUTH
const checkAuth = async (req, res) => {
    res.status(200).json({ pseudo: req.user?.pseudo });
};
exports.checkAuth = checkAuth;
