import express from 'express';

import { updateUser, deleteUser, getUser, getUsers, followUser, unfollowUser } from '../controllers/usersController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteUser);
router.put("/follow", auth, followUser);
router.put("/unfollow", auth, unfollowUser);

export default router;