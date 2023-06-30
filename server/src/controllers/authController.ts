import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import { ILoginResult, IRegisterUser } from '../models/_interfaces/UserInterfaces';
import UserRepository from '../repositories/userRepository';
import { CheckLoginUser, CheckRegisterUser } from './validations/authValidations';

/**
 * Fonction pour l'inscription d'un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const registerUser = async (req: Request, res: Response) => {
    
    // Vérification des données d'inscription de l'utilisateur
    const registerResult =  await CheckRegisterUser(req);
    const user: IRegisterUser = registerResult.user;

    if (registerResult.status !== 200) {
        return res.status(registerResult.status).json({ message: registerResult.message });
    }

    try {
        // Génération d'un nouveau mot de passe crypté
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
    
        // Création d'un nouvel utilisateur dans la base de données
        const result = await UserRepository.createUser({ pseudo: user.pseudo, email: user.email, password: hashedPassword, username: `${user.firstName} ${user.lastName}`});

        // Génération un jeton d'authentification pour l'utilisateur
        const token = jwt.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });

        // Définition des en-têtes de la réponse
        res.header('Access-Control-Allow-Credentials', 'true');

        // Définition du cookie d'authentification avec le jeton d'authentification
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        });
        
        res.status(200).json({ userId: result.pseudo, message: 'Vous êtes correctement inscrit.'})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur est survenue lors de la création de votre compte." });
    }
};

/**
 * Fonction pour la connexion d'un utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const loginUser = async (req: Request, res: Response) => {

    // Vérification des données de connexion de l'utilisateur
    const loginResult =  await CheckLoginUser(req);
    const user: ILoginResult = loginResult.user;

    if (loginResult.status !== 200) {
        return res.status(loginResult.status).json({ message: loginResult.message });
    }

    try {
        // Génération d'un jeton d'authentification pour l'utilisateur
        const token = jwt.sign({ pseudo: user.pseudo, email: user.email, id: user._id }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });
        
        // Définition des en-têtes de la réponse
        res.header('Access-Control-Allow-Credentials', 'true');
        
        // Définition du cookie d'authentification avec le jeton d'authentification
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

/**
 * Fonction pour vérifier l'authentification de l'utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const checkAuth = async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.user?.pseudo, message: 'Nous avons vérifié, l\'utilisateur est bien connecté.' });
}

/**
 * Fonction pour la déconnexion de l'utilisateur
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 */
export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Suppression du cookie d'authentification
        res.clearCookie('Authorization');
        res.status(200).json({ message: 'Vous êtes correctement déconnecté.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la déconnexion.' });
    }
}