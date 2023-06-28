import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRoute from './presentation/routes/usersRoute';
import authRoute from './presentation/routes/authRoute';
import postsRoute from './presentation/routes/postsRoute';

import { DBConnection } from './dal/DBConnection';

const app = express();

//middleware
app.use(bodyParser.json({ limit: "30mb"}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
  
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/posts", postsRoute);

DBConnection(app);