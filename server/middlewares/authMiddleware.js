import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData.id;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}

export default auth;