import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Express } from 'express-serve-static-core';

dotenv.config();

export const DBConnection = async (app: Express) => {
    try {
        const CONNECTION_URL = process.env.CONNECTION_URL;
        const PORT = process.env.PORT;

        if (!CONNECTION_URL) {
            throw new Error('CONNECTION_URL is not defined');
        }
        
        mongoose.set('strictQuery', false);
        mongoose.connect(CONNECTION_URL)
            .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
            .catch((error) => console.log(error.message));
            
    } catch (error: any) {
        console.error('Database connection error:', error.message);
    }
};