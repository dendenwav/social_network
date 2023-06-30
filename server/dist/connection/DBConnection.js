"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Établir la connexion à la base de données MongoDB
 * @param app - Instance de l'application Express
 */
const DBConnection = async (app) => {
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
        mongoose_1.default.set('strictQuery', false);
        // Connexion à la base de données MongoDB
        mongoose_1.default.connect(CONNECTION_URL)
            .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
            .catch((error) => console.log(error.message));
    }
    catch (error) {
        console.error('Database connection error:', error.message);
    }
};
exports.DBConnection = DBConnection;
