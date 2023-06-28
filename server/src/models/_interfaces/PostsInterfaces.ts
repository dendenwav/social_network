export interface IPost {
    postId?: string;
    userId: string;
    message: string;
    selectedFile?: string;
    tags: string[];
    likes?: string[];
}