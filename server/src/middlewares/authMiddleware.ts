import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {    
    if (!req.cookies || !req.cookies.Authorization) {
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
    console.log(ip);
    
    const token = req.cookies.Authorization;

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as jwt.Secret) as JwtPayload;
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, id: decodedToken.id };
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.' });
    }
};

export default auth;