import PostModel from '../../models/PostModel';
import { IPost } from '../../models/_interfaces/PostsInterfaces';

class PostRepository {
    public static async createPost(PostData: IPost): Promise<IPost> {
        const newPost = new PostModel(PostData);
        return newPost.save();
    }

    public static async getPosts(): Promise<IPost[]> {
        return PostModel.find();
    }

    public static async getUserPosts(pseudo: string): Promise<IPost[]> {
        return PostModel.find({ userId: pseudo }).sort({createdAt: -1});
    }

    public static async getPostById(postId: string): Promise<IPost | null> {
        return PostModel.findById(postId);
    }

    public static async updatePost(updatedPostData: IPost): Promise<IPost | null> {
        return PostModel.findByIdAndUpdate(updatedPostData.postId, updatedPostData, { new: true });
    }

    public static async deletePost(postId: string): Promise<IPost | null> {
        return PostModel.findByIdAndDelete(postId);
    }

    public static async likePost(postId: string, userId: string): Promise<IPost | null> {
        return PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });
    }

    public static async unlikePost(postId: string, userId: string): Promise<IPost | null> {
        return PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    }
}

export default PostRepository;
