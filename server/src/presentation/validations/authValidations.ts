import { Request } from 'express';
import bcrypt from 'bcrypt';

import { ILoginResult, ILoginUser, IRegisterUser, IUser } from '../../models/_interfaces/UserInterfaces';
import { ILoginUserReturn, IRegisterUserReturn } from './_interfaces';
import UserRepository from '../../dal/repositories/userRepository';

export const CheckRegisterUser = async (req: Request): Promise<IRegisterUserReturn> => {
    const user: IRegisterUser = req.body;
    const emptyUser: IRegisterUser = { pseudo: "", email: "", password: "", confirmPassword: "", firstName: "", lastName: "" };
    
    // Input validation
    if (!user.pseudo || !user.email || !user.password || !user.confirmPassword || !user.firstName || !user.lastName) {
        console.log('Please enter all required fields');
        return {status: 400, message: 'Veuillez renseigner tous les champs nécéssaires.', user: emptyUser};
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
        console.log('Please enter a valid email');
        return {status: 400, message: 'Veuillez renseigner un email valide.', user: emptyUser};
    }

    if (user.password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return { status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.', user: emptyUser};
    }

    try {
        const existingPseudo = await UserRepository.getUserByPseudo(user.pseudo);
        const existingEmail = await UserRepository.getUserByEmail(user.email);

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

export const CheckLoginUser = async (req: Request): Promise<ILoginUserReturn> => {
    const user: ILoginUser = req.body;
    const emptyUser: ILoginResult = { _id: "", pseudo: "", email: "" };
    
    // Input validation
    if (!user.userId || !user.password) {
        console.log('Identifier and password are required.');
        return {status: 400, message: 'Veuillez renseigner un identifiant et un mot de passe.', user: emptyUser};
    }        

    if (user.password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return { status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.', user: emptyUser};
    }

    try {
        var existingUser: IUser | null = await UserRepository.getUserByPseudo(user.userId);

        if (!existingUser) {
            existingUser = await UserRepository.getUserByEmail(user.userId);
        }

        if (!existingUser) {
            console.log('Incorrect email or pseudo.');
            return { status: 401, message: 'Email ou pseudo incorrect.', user: emptyUser };
        }

        if (!existingUser.password) {
            console.log('No password set for this account.');
            return { status: 401, message: 'Aucun mot de passe n\'est associé à ce compte.', user: emptyUser };
        }      

        const isPasswordCorrect = await bcrypt.compare(user.password, existingUser.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect password.');
            return { status: 401, message: 'Le mot de passe ne correspond pas.', user: emptyUser };
        }
        
        if (existingUser._id && existingUser.email) {
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