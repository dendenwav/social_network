import mongoose from 'mongoose';
declare const PostModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    tags: string[];
    likes: string[];
    message?: string | undefined;
    selectedFile?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: string;
    tags: string[];
    likes: string[];
    message?: string | undefined;
    selectedFile?: string | undefined;
}>>;
export default PostModel;
