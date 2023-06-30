import express from 'express';

import { registerUser, loginUser, checkAuth, logoutUser } from '../authController';
import auth from '../middlewares/authMiddleware';

// Création du routeur
const router = express.Router();

// Définition des routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", auth, logoutUser);
router.get("/", auth, checkAuth);

export default router;