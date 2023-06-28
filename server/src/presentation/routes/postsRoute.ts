import express from 'express';

import { getPost, getPosts, getFriendsPosts, getUserPosts, createPost, updatePost, deletePost, likePost } from '../controllers/postsController';
import auth from '../middlewares/authMiddleware';

const router = express.Router();

router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/user/:userId", getUserPosts);
router.get("/friends/:userId", getFriendsPosts);
router.post("/", auth, createPost);
router.put("/", auth, updatePost);
router.delete("/", auth, deletePost);
router.put("/like", auth, likePost);

export default router;