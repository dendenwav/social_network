import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    if (!req.cookies) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }

    const token = req.cookies.Authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing.' });
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = { pseudo: decodedToken.pseudo, email: decodedToken.email, id: decodedToken.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

export default auth;