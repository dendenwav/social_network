import { IPost } from '../models/_interfaces/PostsInterfaces';

export interface IPostRepository {
    createPost(PostData: IPost): Promise<IPost>;
    getPosts(): Promise<IPost[]>;
    getUserPosts(pseudo: string): Promise<IPost[]>;
    getPostById(postId: string): Promise<IPost | null>;
    updatePost(updatedPostData: IPost): Promise<IPost | null>;
    deletePost(postId: string): Promise<IPost | null>;
    likePost(postId: string, userId: string): Promise<IPost | null>;
    unlikePost(postId: string, userId: string): Promise<IPost | null>;
};