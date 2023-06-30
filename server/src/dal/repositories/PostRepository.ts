import PostModel from '../../models/PostModel';
import { IPost } from '../../models/_interfaces/PostsInterfaces';

class PostRepository {
  /**
   * Crée un nouveau post
   * @param PostData - Données du post à créer
   * @returns Le post créé
   */
  public static async createPost(PostData: IPost): Promise<IPost> {
    const newPost = new PostModel(PostData);
    return newPost.save();
  }

  /**
   * Récupère tous les posts
   * @returns Une liste de tous les posts
   */
  public static async getPosts(): Promise<IPost[]> {
    return PostModel.find();
  }

  /**
   * Récupère tous les posts d'un utilisateur spécifique
   * @param pseudo - Pseudo de l'utilisateur
   * @returns Une liste des posts de l'utilisateur spécifié
   */
  public static async getUserPosts(pseudo: string): Promise<IPost[]> {
    return PostModel.find({ userId: pseudo }).sort({ createdAt: -1 });
  }

  /**
   * Récupère un post par son identifiant
   * @param postId - Identifiant du post
   * @returns Le post correspondant à l'identifiant donné
   */
  public static async getPostById(postId: string): Promise<IPost | null> {
    return PostModel.findById(postId);
  }

  /**
   * Met à jour un post existant
   * @param updatedPostData - Données mises à jour du post
   * @returns Le post mis à jour
   */
  public static async updatePost(updatedPostData: IPost): Promise<IPost | null> {
    return PostModel.findByIdAndUpdate(updatedPostData.postId, updatedPostData, { new: true });
  }

  /**
   * Supprime un post par son identifiant
   * @param postId - Identifiant du post à supprimer
   * @returns Le post supprimé
   */
  public static async deletePost(postId: string): Promise<IPost | null> {
    return PostModel.findByIdAndDelete(postId);
  }

  /**
   * Ajoute un utilisateur aux likes d'un post
   * @param postId - Identifiant du post
   * @param userId - Identifiant de l'utilisateur
   * @returns Le post mis à jour
   */
  public static async likePost(postId: string, userId: string): Promise<IPost | null> {
    return PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
  }

  /**
   * Retire un utilisateur des likes d'un post
   * @param postId - Identifiant du post
   * @param userId - Identifiant de l'utilisateur
   * @returns Le post mis à jour
   */
  public static async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
  }
}

export default PostRepository;

