import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Fonction pour vérifier si l'utilisateur est connecté
 * @param req - L'objet Request de la requête
 * @param res - L'objet Response pour renvoyer la réponse
 * @param next - L'objet NextFunction pour passer à la fonction suivante
 */
const auth = (req: Request, res: Response, next: NextFunction) => {

    // Vérification de la présence du cookie d'authentification
    if (!req.cookies || !req.cookies.Authorization) {
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }

    // Récupération de l'adresse IP de l'utilisateur (pour les logs)
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
    console.log(ip);
    
    // Récupération du token
    const token = req.cookies.Authorization;

    try {
        // Vérification du token
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as jwt.Secret) as JwtPayload;

        // Ajout des informations de l'utilisateur dans la requête
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, _id: decodedToken.id };
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }
};

export default auth;