"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const usersRoute_1 = __importDefault(require("./controllers/routes/usersRoute"));
const authRoute_1 = __importDefault(require("./controllers/routes/authRoute"));
const postsRoute_1 = __importDefault(require("./controllers/routes/postsRoute"));
const DBConnection_1 = require("./connection/DBConnection");
// Instanciation de l'application express
const app = (0, express_1.default)();
// Ajout du middleware body-parser pour parser les requêtes en JSON
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
// Configuration de cors avec le port 3000 et les méthodes autorisées ainsi que les headers
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// Ajout du middleware cors pour autoriser les requêtes cross-domain
app.use((0, cors_1.default)(corsOptions));
// Ajout du middleware cookie-parser pour parser les cookies
app.use((0, cookie_parser_1.default)());
// Configuration des routes
app.use("/auth", authRoute_1.default);
app.use("/users", usersRoute_1.default);
app.use("/posts", postsRoute_1.default);
// Lancement du serveur sur le port 5000
(0, DBConnection_1.DBConnection)(app);
