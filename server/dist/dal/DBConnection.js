"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DBConnection = async (app) => {
    try {
        const CONNECTION_URL = process.env.CONNECTION_URL;
        const PORT = process.env.PORT;
        if (!CONNECTION_URL) {
            throw new Error('CONNECTION_URL is not defined');
        }
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connect(CONNECTION_URL)
            .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
            .catch((error) => console.log(error.message));
    }
    catch (error) {
        console.error('Database connection error:', error.message);
    }
};
exports.DBConnection = DBConnection;
