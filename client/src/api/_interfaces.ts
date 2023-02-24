export interface IRegisterUser {
    pseudo: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IUser {
    userId: string;
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
    coverPicture?: string;
    followers?: string[];
    followings?: string[];
    isAdmin?: boolean;
    desc?: string;
    city?: string;
    from?: string;
    relationship?: number;
}

export interface IPost {
    postId: string;
    userId: string;
    message: string;
    selectedFile?: string;
    tags: string[];
    likes: string[];
}