import { IPost } from "../../models/_interfaces/PostsInterfaces";
import { ILoginResult, IRegisterUser } from "../../models/_interfaces/UserInterfaces";

interface ICheckReturn {
    status: number;
    message: string;
}

export interface IRegisterReturn extends ICheckReturn { user: IRegisterUser }

export interface ILoginReturn extends ICheckReturn { user: ILoginResult }

export interface ICurrentUserReturn extends ICheckReturn { pseudo: string }

export interface IPostReturn extends ICheckReturn { post: IPost }