import express from 'express';

import { getPost, getPosts, getFriendsPosts, getUserPosts, createPost, updatePost, deletePost, likePost } from '../controllers/postsController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/:id/user", getUserPosts);
router.get("/:id/friends", getFriendsPosts);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);

export default router;