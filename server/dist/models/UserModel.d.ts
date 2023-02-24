import mongoose from "mongoose";
export interface IUser extends Document {
    pseudo: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: string[];
    followings: string[];
    isAdmin: boolean;
    desc: string;
    city: string;
    from: string;
    relationship: number;
}
declare const UserModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: any[];
    followings: any[];
    isAdmin: boolean;
    pseudo?: string | undefined;
    desc?: string | undefined;
    username?: string | undefined;
    city?: string | undefined;
    from?: string | undefined;
    relationship?: number | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    profilePicture: string;
    coverPicture: string;
    followers: any[];
    followings: any[];
    isAdmin: boolean;
    pseudo?: string | undefined;
    desc?: string | undefined;
    username?: string | undefined;
    city?: string | undefined;
    from?: string | undefined;
    relationship?: number | undefined;
}>>;
export default UserModel;
