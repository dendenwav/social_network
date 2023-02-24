import express from 'express';

import { registerUser, loginUser, checkAuth } from '../controllers/authController';
import auth from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", auth, checkAuth);

export default router;