import express from 'express';

import { updateUser, deleteUser, getUser, getUsers, followUser, unfollowUser } from '../controllers/usersController';
import auth from '../middlewares/authMiddleware';

// Création du routeur
const router = express.Router();

// Définition des routes
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.put("/follow/:id", auth, followUser);
router.put("/unfollow/:id", auth, unfollowUser);

export default router;