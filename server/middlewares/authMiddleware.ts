import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {    
    if (!req.cookies) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }

    const token = req.cookies.Authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as jwt.Secret) as JwtPayload;
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, id: decodedToken.id };
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

export default auth;