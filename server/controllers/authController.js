import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

//REGISTER
export const registerUser = async (req, res) => {
    console.log(req.body);
    const { pseudo, email, password, confirmPassword, firstName, lastName } = req.body;

    // Input validation
    if (!pseudo || !email || !password || !confirmPassword || !firstName || !lastName) {
        console.log('Please enter all required fields');
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log('Please enter a valid email');
        return res.status(400).json({ message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
        console.log('Password must be at least 8 characters long.');
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        const existingPseudo = await UserModel.findOne({ pseudo });
        const existingEmail = await UserModel.findOne({ email });

        if (existingPseudo && existingEmail) {
            console.log('An account with this pseudonym and email already exists');
            return res.status(400).json({ message: 'An account with this pseudonym and email already exists' });
        } else if (existingPseudo) {
            console.log('An account with this pseudonym already exists');
            return res.status(400).json({ message: 'An account with this pseudonym already exists' });
        } else if (existingEmail) {
            console.log('An account with this email already exists');
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await UserModel.create({ pseudo, email, password: hashedPassword, username: `${firstName} ${lastName}`});
        const token = jwt.sign({ pseudo: result.pseudo, email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.header('Access-Control-Allow-Credentials', true);

        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            httpOnly: true,
            sameSite: 'strict'
        });
        
        const user = result.toJSON();
        delete user.email;
        delete user.password;
        delete user.updatedAt;
        
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
};
  
//LOGIN
export const loginUser = async (req, res) => {
    console.log(req.body);
    const { userId, password } = req.body;

    try {
        if (!userId || !password) {
            console.log('Identifier and password are required.');
            return res.status(400).json({ message: 'Identifier and password are required.' });
        }        

        if (password.length < 8) {
            console.log('Password must be at least 8 characters long.');
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        var existingUser = await UserModel.findOne({ pseudo: userId });

        if (!existingUser) {
            existingUser = await UserModel.findOne({ email: userId });
        }

        if (!existingUser) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect email or password.');
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign({ pseudo: existingUser.pseudo, email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.header('Access-Control-Allow-Credentials', true);
        
        res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600 * 1000, // 1 hour in milliseconds
            httpOnly: true,
            sameSite: 'strict'
        });
        
        const user = existingUser.toJSON();
        delete user.email;
        delete user.password;
        delete user.updatedAt;
        
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
};