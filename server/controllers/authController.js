import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

//REGISTER
export const registerUser = async (req, res) => {
    const { pseudo, email, password, confirmPassword, firstName, lastName } = req.body;

    // Input validation
    if (!pseudo || !email || !password || !confirmPassword || !firstName || !lastName) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' });
    }

    try {
        const existingPseudo = await UserModel.findOne({ pseudo });
        const existingEmail = await UserModel.findOne({ email });

        if (existingPseudo && existingEmail) {
            return res.status(400).json({ message: 'An account with this pseudonym and email already exists' });
        } else if (existingPseudo) {
            return res.status(400).json({ message: 'An account with this pseudonym already exists' });
        } else if (existingEmail) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await UserModel.create({ pseudo, email, password: hashedPassword, username: `${firstName} ${lastName}`});
        const token = jwt.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
};
  
//LOGIN
export const loginUser = async (req, res) => {
    const { userIdentitier, password } = req.body;

    try {
        if (!userIdentitier || !password) {
            return res.status(400).json({ message: 'Identifier and password are required.' });
        }        

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        var existingUser = await UserModel.findOne({ pseudo: userIdentitier });

        if (!existingUser) {
            existingUser = await UserModel.findOne({ email: userIdentitier });
        }

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({ result: existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
};