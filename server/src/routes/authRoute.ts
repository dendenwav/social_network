import express from 'express';

import { registerUser, loginUser, checkAuth, logoutUser } from '../controllers/authController';
import auth from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", auth, logoutUser);
router.get("/", auth, checkAuth);

export default router;