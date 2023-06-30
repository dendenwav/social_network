import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Express } from 'express-serve-static-core';

dotenv.config();

/**
 * Établir la connexion à la base de données MongoDB
 * @param app - Instance de l'application Express
 */
export const DBConnection = async (app: Express) => {
    try {
        const CONNECTION_URL = process.env.CONNECTION_URL;
        const PORT = process.env.PORT;

        // Vérification des variables d'environnement
        if (!CONNECTION_URL) {
            throw new Error('CONNECTION_URL is not defined');
        }

        if (!PORT) {
            throw new Error('PORT is not defined');
        }
        
        // Désactivation du mode strict pour les requêtes MongoDB
        mongoose.set('strictQuery', false);

        // Connexion à la base de données MongoDB
        mongoose.connect(CONNECTION_URL)
            .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
            .catch((error) => console.log(error.message));
            
    } catch (error: any) {
        console.error('Database connection error:', error.message);
    }
};