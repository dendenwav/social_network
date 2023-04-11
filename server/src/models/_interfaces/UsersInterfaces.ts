export interface IRegisterUser {
    pseudo: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ILoginUser {
    userId: string;
    password: string;
}

export interface IUser {
    pseudo: string;
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