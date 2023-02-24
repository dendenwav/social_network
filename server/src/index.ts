import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRoute from './routes/usersRoute';
import authRoute from './routes/authRoute';
import postsRoute from './routes/postsRoute';

const app = express();
dotenv.config();

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

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;

if (!CONNECTION_URL) {
    throw new Error('CONNECTION_URL is not defined');
}

if (!PORT) {
    throw new Error('PORT is not defined');
}

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));