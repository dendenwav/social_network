"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = require("../ControllersLayer/postsController");
const authMiddleware_1 = __importDefault(require("../MiddlewaresLayer/authMiddleware"));
const router = express_1.default.Router();
router.get("/", postsController_1.getPosts);
router.get("/:postId", postsController_1.getPost);
router.get("/user/:userId", postsController_1.getUserPosts);
router.get("/friends/:userId", postsController_1.getFriendsPosts);
router.post("/", authMiddleware_1.default, postsController_1.createPost);
router.put("/", authMiddleware_1.default, postsController_1.updatePost);
router.delete("/", authMiddleware_1.default, postsController_1.deletePost);
router.put("/like", authMiddleware_1.default, postsController_1.likePost);
exports.default = router;
