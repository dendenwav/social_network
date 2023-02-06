import express from 'express';

import { getPost, getFriendsPosts, getUserPosts, createPost, updatePost, deletePost, likePost } from '../controllers/postsController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getPost);
router.get("/user/:id", getUserPosts);
router.get("/friends/:id", getFriendsPosts);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);

export default router;