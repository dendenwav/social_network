import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRoute from './presentation/routes/usersRoute';
import authRoute from './presentation/routes/authRoute';
import postsRoute from './presentation/routes/postsRoute';

import { DBConnection } from './dal/DBConnection';

// Instanciation de l'application express
const app = express();

// Ajout du middleware body-parser pour parser les requêtes en JSON
app.use(bodyParser.json({ limit: "30mb"}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

// Configuration de cors avec le port 3000 et les méthodes autorisées ainsi que les headers
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Ajout du middleware cors pour autoriser les requêtes cross-domain
app.use(cors(corsOptions));

// Ajout du middleware cookie-parser pour parser les cookies
app.use(cookieParser());

// Configuration des routes
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/posts", postsRoute);

// Lancement du serveur sur le port 5000
DBConnection(app);