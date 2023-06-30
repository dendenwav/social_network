"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostModel_1 = __importDefault(require("../models/PostModel"));
class PostRepository {
    /**
     * Crée un nouveau post
     * @param PostData - Données du post à créer
     * @returns Le post créé
     */
    static async createPost(PostData) {
        const newPost = new PostModel_1.default(PostData);
        return newPost.save();
    }
    /**
     * Récupère tous les posts
     * @returns Une liste de tous les posts
     */
    static async getPosts() {
        return PostModel_1.default.find();
    }
    /**
     * Récupère tous les posts d'un utilisateur spécifique
     * @param pseudo - Pseudo de l'utilisateur
     * @returns Une liste des posts de l'utilisateur spécifié
     */
    static async getUserPosts(pseudo) {
        return PostModel_1.default.find({ userId: pseudo }).sort({ createdAt: -1 });
    }
    /**
     * Récupère un post par son identifiant
     * @param postId - Identifiant du post
     * @returns Le post correspondant à l'identifiant donné
     */
    static async getPostById(postId) {
        return PostModel_1.default.findById(postId);
    }
    /**
     * Met à jour un post existant
     * @param updatedPostData - Données mises à jour du post
     * @returns Le post mis à jour
     */
    static async updatePost(updatedPostData) {
        return PostModel_1.default.findByIdAndUpdate(updatedPostData.postId, updatedPostData, { new: true });
    }
    /**
     * Supprime un post par son identifiant
     * @param postId - Identifiant du post à supprimer
     * @returns Le post supprimé
     */
    static async deletePost(postId) {
        return PostModel_1.default.findByIdAndDelete(postId);
    }
    /**
     * Ajoute un utilisateur aux likes d'un post
     * @param postId - Identifiant du post
     * @param userId - Identifiant de l'utilisateur
     * @returns Le post mis à jour
     */
    static async likePost(postId, userId) {
        return PostModel_1.default.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
    }
    /**
     * Retire un utilisateur des likes d'un post
     * @param postId - Identifiant du post
     * @param userId - Identifiant de l'utilisateur
     * @returns Le post mis à jour
     */
    static async unlikePost(postId, userId) {
        return PostModel_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    }
}
exports.default = PostRepository;
