import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { email: decodedToken.email, id: decodedToken.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }
};

export default auth;