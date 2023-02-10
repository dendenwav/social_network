import express from 'express';

import { getPost, getPosts, getFriendsPosts, getUserPosts, createPost, updatePost, deletePost, likePost } from '../controllers/postsController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/user/:id", getUserPosts);
router.get("/friends/:id", getFriendsPosts);
router.post("/", auth, createPost);
router.put("/", auth, updatePost);
router.delete("/", auth, deletePost);
router.put("/like", auth, likePost);

export default router;