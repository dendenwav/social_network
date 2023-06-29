import { IPost } from "../../models/_interfaces/PostsInterfaces";
import { ILoginResult, IRegisterUser, IUser } from "../../models/_interfaces/UserInterfaces";

interface ICheckReturn {
    status: number;
    message: string;
}

export interface IRegisterUserReturn extends ICheckReturn { user: IRegisterUser }

export interface ILoginUserReturn extends ICheckReturn { user: ILoginResult }

export interface IUserReturn extends ICheckReturn { user: IUser }

export interface IPostReturn extends ICheckReturn { post: IPost }

export interface IPseudoReturn extends ICheckReturn { pseudo: string }

export interface IPostIdReturn extends ICheckReturn { postId: string }

export interface IPseudosForFollowReturn extends ICheckReturn { 
    currentPseudo: string; 
    userToFollowPseudo: string; 
}

export interface IPostIdPostAndUserIdReturn extends ICheckReturn {
    userId: string;
    post: IPost;
    postId: string;
}