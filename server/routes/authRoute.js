import express from 'express';

import { registerUser, loginUser, checkAuth } from '../controllers/authController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", auth, checkAuth);

export default router;