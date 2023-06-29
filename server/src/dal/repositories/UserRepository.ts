import UserModel from '../../models/UserModel';
import { IUser } from '../../models/_interfaces/UserInterfaces';

class UserRepository {
    public static async createUser(userData: IUser): Promise<IUser> {
        const newUser = new UserModel(userData);
        return newUser.save();
    }

    public static async getUsers(elementsToIgnored?: Object): Promise<IUser[]> {
        return await UserModel.find({}, elementsToIgnored);
    }

    public static async getUserByPseudo(pseudo: string, elementsToIgnored?: Object): Promise<IUser | null> {
        return  await UserModel.findOne({ pseudo: pseudo }, elementsToIgnored);
    }

    public static async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email: email });
    }

    public static async updateUser(updatedUserData: IUser): Promise<IUser> {
        const resultUser = await UserModel.findByIdAndUpdate(updatedUserData._id, updatedUserData, { new: true });
        const emptyUser: IUser = {
            pseudo: "",
        };
        if (resultUser) return resultUser;
        return emptyUser;
    }

    public static async deleteUser(userId: string): Promise<IUser | null> {
        return UserModel.findByIdAndDelete(userId);
    }

    public static async followUser(userId: string, userToFollowId: string): Promise<IUser | null> {
        return (
            UserModel.findByIdAndUpdate(userId, { $push: { followings: userToFollowId } }, { new: true }), 
            UserModel.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true })
        );
    }

    public static async unfollowUser(userId: string, userToUnfollowId: string): Promise<IUser | null> {
        return (
            UserModel.findByIdAndUpdate(userId, { $pull: { followings: userToUnfollowId } }, { new: true }),
            UserModel.findByIdAndUpdate(userToUnfollowId, { $pull: { followers: userId } }, { new: true })
        );
    }
}

export default UserRepository;
