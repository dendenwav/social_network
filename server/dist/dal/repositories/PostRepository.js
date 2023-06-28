"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostModel_1 = __importDefault(require("../../models/PostModel"));
class PostRepository {
    static async createPost(PostData) {
        const newPost = new PostModel_1.default(PostData);
        return newPost.save();
    }
    static async getPosts() {
        return PostModel_1.default.find();
    }
    static async getUserPosts(pseudo) {
        return PostModel_1.default.find({ userId: pseudo }).sort({ createdAt: -1 });
    }
    static async getPostById(postId) {
        return PostModel_1.default.findById(postId);
    }
    static async updatePost(updatedPostData) {
        return PostModel_1.default.findByIdAndUpdate(updatedPostData.postId, updatedPostData, { new: true });
    }
    static async deletePost(postId) {
        return PostModel_1.default.findByIdAndDelete(postId);
    }
    static async likePost(postId, userId) {
        return PostModel_1.default.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
    }
    static async unlikePost(postId, userId) {
        return PostModel_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    }
}
exports.default = PostRepository;
