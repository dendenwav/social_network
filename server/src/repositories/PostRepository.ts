import PostModel from '../models/PostModel';
import { IPost } from '../models/_interfaces/PostsInterfaces';
import { StaticImplements } from './Utility';
import { IPostRepository } from './IPostRepository';

@StaticImplements<IPostRepository>()
export class PostRepository {

  /**
   * Crée un nouveau post
   * @param PostData - Données du post à créer
   * @returns Le post créé
   */
  static async createPost(PostData: IPost): Promise<IPost> {
    const newPost = new PostModel(PostData);
    return await newPost.save();
  }

  /**
   * Récupère tous les posts
   * @returns Une liste de tous les posts
   */
  static async getPosts(): Promise<IPost[]> {
    return await PostModel.find();
  }

  /**
   * Récupère tous les posts d'un utilisateur spécifique
   * @param pseudo - Pseudo de l'utilisateur
   * @returns Une liste des posts de l'utilisateur spécifié
   */
  static async getUserPosts(pseudo: string): Promise<IPost[]> {
    return await PostModel.find({ userId: pseudo }).sort({ createdAt: -1 });
  }

  /**
   * Récupère un post par son identifiant
   * @param postId - Identifiant du post
   * @returns Le post correspondant à l'identifiant donné
   */
  static async getPostById(postId: string): Promise<IPost | null> {
    return await PostModel.findById(postId);
  }

  /**
   * Met à jour un post existant
   * @param updatedPostData - Données mises à jour du post
   * @returns Le post mis à jour
   */
  static async updatePost(updatedPostData: IPost): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(updatedPostData.postId, updatedPostData, { new: true });
  }

  /**
   * Supprime un post par son identifiant
   * @param postId - Identifiant du post à supprimer
   * @returns Le post supprimé
   */
  static async deletePost(postId: string): Promise<IPost | null> {
    return await PostModel.findByIdAndDelete(postId);
  }

  /**
   * Ajoute un utilisateur aux likes d'un post
   * @param postId - Identifiant du post
   * @param userId - Identifiant de l'utilisateur
   * @returns Le post mis à jour
   */
  static async likePost(postId: string, userId: string): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
  }

  /**
   * Retire un utilisateur des likes d'un post
   * @param postId - Identifiant du post
   * @param userId - Identifiant de l'utilisateur
   * @returns Le post mis à jour
   */
  static async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
  }
}

export default PostRepository;

