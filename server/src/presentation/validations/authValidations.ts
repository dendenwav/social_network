import { Request } from 'express';
import bcrypt from 'bcrypt';

import { ILoginResult, ILoginUser, IRegisterUser, IUser } from '../../models/_interfaces/UserInterfaces';
import { ILoginUserReturn, IRegisterUserReturn } from './_interfaces';
import UserRepository from '../../dal/repositories/userRepository';

/**
 * Fonction pour vérifier les données d'inscription d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'utilisateur
 */
export const CheckRegisterUser = async (req: Request): Promise<IRegisterUserReturn> => {

    // Récupération des données de l'utilisateur
    const user: IRegisterUser = req.body;

    // Création d'un utilisateur vide
    const emptyUser: IRegisterUser = { pseudo: "", email: "", password: "", confirmPassword: "", firstName: "", lastName: "" };

    // Vérifie si tous les champs sont renseignés
    if (!user.pseudo || !user.email || !user.password || !user.confirmPassword || !user.firstName || !user.lastName) {
        console.log('Please enter all required fields');
        return {status: 400, message: 'Veuillez renseigner tous les champs nécéssaires.', user: emptyUser};
    }

    // Vérifie si le mot de passe et la confirmation sont identiques
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
        console.log('Please enter a valid email');
        return {status: 400, message: 'Veuillez renseigner un email valide.', user: emptyUser};
    }

    // Vérifie si la longueur du mot de passe est suffisante
    if (user.password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return { status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.', user: emptyUser};
    }

    try {
        // Essaie de récupérer un utilisateur avec le même pseudo ou le même email
        const existingPseudo = await UserRepository.getUserByPseudo(user.pseudo);
        const existingEmail = await UserRepository.getUserByEmail(user.email);

        // Vérifie si un utilisateur avec le même pseudo ou le même email existe déjà
        if (existingPseudo && existingEmail) {
            console.log('An account with this pseudonym and email already exists');
            return { status: 400, message: 'Un compte avec ce pseudo et cet email existe déjà.', user: emptyUser };
        } else if (existingPseudo) {
            console.log('An account with this pseudonym already exists');
            return { status: 400, message: 'Un compte avec ce pseudo existe déjà.', user: emptyUser };
        } else if (existingEmail) {
            console.log('An account with this email already exists');
            return { status: 400, message: 'Un compte avec cet email existe déjà.', user: emptyUser };
        }

        // Vérifie si le mot de passe et la confirmation sont identiques
        if (user.password !== user.confirmPassword) {
            console.log('Passwords do not match');
            return { status: 400, message: 'Les mots de passe ne correspondent pas.', user: emptyUser };
        }
        
        return {status: 200, message: 'OK', user};
    } catch(err) {
        console.error(err);
        return {status: 500, message: 'Une erreur est survenue lors de la verification des données envoyées pour l\'inscription de l\'utilisateur', user: emptyUser};
    }

};

/**
 * Fonction pour vérifier les données de connexion d'un utilisateur
 * @param req - L'objet Request de la requête
 * @returns Un objet contenant le statut de la requête, un message et l'utilisateur
 */
export const CheckLoginUser = async (req: Request): Promise<ILoginUserReturn> => {

    // Récupération des données de l'utilisateur
    const user: ILoginUser = req.body;

    // Création d'un utilisateur vide
    const emptyUser: ILoginResult = { _id: "", pseudo: "", email: "" };
    
    // Vérifie si tous les champs sont renseignés
    if (!user.userId || !user.password) {
        console.log('Identifier and password are required.');
        return {status: 400, message: 'Veuillez renseigner un identifiant et un mot de passe.', user: emptyUser};
    }        

    // Vérifie si la longueur du mot de passe est suffisante
    if (user.password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return { status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.', user: emptyUser};
    }

    try {
        // Essaie de récupérer un utilisateur avec le pseudo
        var existingUser: IUser | null = await UserRepository.getUserByPseudo(user.userId);

        // Vérifie si un utilisateur avec le pseudo est trouvé
        if (!existingUser) {

            // Essaie de récupérer un utilisateur avec le email
            existingUser = await UserRepository.getUserByEmail(user.userId);
        }

        // Vérifie si un utilisateur avec l'email est trouvé
        if (!existingUser) {
            console.log('Incorrect email or pseudo.');
            return { status: 401, message: 'Email ou pseudo incorrect.', user: emptyUser };
        }

        // Vérifie si le mot de passe est défini
        if (!existingUser.password) {
            console.log('No password set for this account.');
            return { status: 401, message: 'Aucun mot de passe n\'est associé à ce compte.', user: emptyUser };
        }      

        // Vérifie si le mot de passe est correct
        const isPasswordCorrect = await bcrypt.compare(user.password, existingUser.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect password.');
            return { status: 401, message: 'Le mot de passe ne correspond pas.', user: emptyUser };
        }
        
        // Vérifie si l'utilisateur a un id et un email
        if (existingUser._id && existingUser.email) {

            // Création d'un utilisateur de retour
            var userReturn: ILoginResult = {
                _id: existingUser._id,
                pseudo: existingUser.pseudo,
                email: existingUser.email
            };
            
            return {status: 200, message: 'OK', user: userReturn};
        } else {
            return {status: 500, message: 'Une erreur est survenue lors de la verification des données envoyées pour l\'inscription de l\'utilisateur', user: emptyUser};
        }
    } catch(err) {
        console.error(err);
        return {status: 500, message: 'Une erreur est survenue lors de la verification des données envoyées pour l\'inscription de l\'utilisateur', user: emptyUser};
    }
}