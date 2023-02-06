import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

//REGISTER
export const registerUser = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {     
        const existingUser = await UserModel.findOne({ email });

        if (existingUser)
        {
            console.log('There is an account using this email.');
            return res.status(400).json({ message: 'There is an account using this email.'});
        }

        if (password !== confirmPassword)
        {
            console.log('Passwords don\'t match.');
            return res.status(400).json({ message: 'Passwords don\'t match.'});
        }

        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await UserModel.create({ email, password: hashedPassword, username: `${firstName} ${lastName}`});
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });
        
        res.status(200).json({ result, token});
    } catch (err) {
        res.status(500).json({ message: "Register doesn't work" });
        
        console.log(err);
    }
};
  
//LOGIN
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser)
            return res.status(404).json({ message: 'User doesn\'t exist.'});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect)
            return res.status(400).json({ message: 'Invalid credentials.'});

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token});
    } catch (err) {
        res.status(500).json({ message: "Login doesn't work" });
    }
};