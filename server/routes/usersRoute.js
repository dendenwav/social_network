import express from 'express';

import { updateUser, deleteUser, getUser, getUsers, followUser, unfollowUser } from '../controllers/usersController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", auth, updateUser);
router.delete("/:id"/* , auth */, deleteUser);
router.put("/:id/follow"/* , auth */, followUser);
router.put("/:id/unfollow"/* , auth */, unfollowUser);

export default router;