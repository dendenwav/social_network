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

export interface ILoginResult {
    _id: string;
    pseudo: string;
    email: string;
}

export interface IUser {
    _id?: string;
    pseudo: string;
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
    coverPicture?: string;
    importedPics?: string[];
    followers?: string[];
    followings?: string[];
    isAdmin?: boolean;
    desc?: string;
    city?: string;
    from?: string;
    relationship?: number;
}