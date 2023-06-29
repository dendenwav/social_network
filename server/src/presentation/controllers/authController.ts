import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import { ILoginResult, IRegisterUser } from '../../models/_interfaces/UserInterfaces';
import UserRepository from '../../dal/repositories/userRepository';
import { CheckLoginUser, CheckRegisterUser } from '../validations/authValidations';

//REGISTER
export const registerUser = async (req: Request, res: Response) => {
    const registerResult =  await CheckRegisterUser(req);
    const user: IRegisterUser = registerResult.user;

    if (registerResult.status !== 200) {
        return res.status(registerResult.status).json({ message: registerResult.message });
    }

    try {
        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
    
        const result = await UserRepository.createUser({ pseudo: user.pseudo, email: user.email, password: hashedPassword, username: `${user.firstName} ${user.lastName}`});
        const token = jwt.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });

        res.header('Access-Control-Allow-Credentials', 'true');

        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            httpOnly: true,
            sameSite: 'strict'
        });
        
        res.status(200).json({ userId: result.pseudo, message: 'Vous êtes correctement inscrit.'})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur est survenue lors de la création de votre compte." });
    }
};

//LOGIN
export const loginUser = async (req: Request, res: Response) => {
    const loginResult =  await CheckLoginUser(req);
    const user: ILoginResult = loginResult.user;

    if (loginResult.status !== 200) {
        return res.status(loginResult.status).json({ message: loginResult.message });
    }

    try {
        const token = jwt.sign({ pseudo: user.pseudo, email: user.email, id: user._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });
        
        res.header('Access-Control-Allow-Credentials', 'true');
        
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            httpOnly: true,
            sameSite: 'strict'
        });
        
        res.status(200).json({ userId: user.pseudo, message: 'Vous êtes correctement connecté.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
};

// CHECK AUTH
export const checkAuth = async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.user?.pseudo, message: 'Nous avons vérifié, l\'utilisateur est bien connecté.' });
}

// LOGOUT
export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('Authorization');
        res.status(200).json({ message: 'Vous êtes correctement déconnecté.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la déconnexion.' });
    }
}