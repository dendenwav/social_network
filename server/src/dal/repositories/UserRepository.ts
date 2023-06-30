import UserModel from '../../models/UserModel';
import { IUser } from '../../models/_interfaces/UserInterfaces';

class UserRepository {
    /**
     * Crée un nouvel utilisateur
     * @param userData - Données de l'utilisateur à créer
     * @returns L'utilisateur créé
     */
    public static async createUser(userData: IUser): Promise<IUser> {
        const newUser = new UserModel(userData);
        return newUser.save();
    }

    /**
     * Récupère tous les utilisateurs
     * @param elementsToIgnored - Éléments à ignorer dans la récupération des utilisateurs
     * @returns Une liste de tous les utilisateurs
     */
    public static async getUsers(elementsToIgnored?: Object): Promise<IUser[]> {
        return UserModel.find({}, elementsToIgnored);
    }

    /**
     * Récupère un utilisateur par son pseudo
     * @param pseudo - Pseudo de l'utilisateur
     * @param elementsToIgnored - Éléments à ignorer dans la récupération de l'utilisateur
     * @returns L'utilisateur correspondant au pseudo donné
     */
    public static async getUserByPseudo(pseudo: string, elementsToIgnored?: Object): Promise<IUser | null> {
        return UserModel.findOne({ pseudo: pseudo }, elementsToIgnored);
    }

    /**
     * Récupère un utilisateur par son email
     * @param email - Email de l'utilisateur
     * @returns L'utilisateur correspondant à l'email donné
     */
    public static async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email: email });
    }

    /**
     * Met à jour un utilisateur existant
     * @param updatedUserData - Données mises à jour de l'utilisateur
     * @returns L'utilisateur mis à jour
     */
    public static async updateUser(updatedUserData: IUser): Promise<IUser> {
        const resultUser = await UserModel.findByIdAndUpdate(updatedUserData._id, updatedUserData, { new: true });
        const emptyUser: IUser = {
        pseudo: "",
        };
        if (resultUser) return resultUser;
        return emptyUser;
    }

    /**
     * Supprime un utilisateur par son identifiant
     * @param userId - Identifiant de l'utilisateur à supprimer
     * @returns L'utilisateur supprimé
     */
    public static async deleteUser(userId: string): Promise<IUser | null> {
        return UserModel.findByIdAndDelete(userId);
    }

    /**
     * Ajoute un utilisateur aux abonnements d'un autre utilisateur
     * @param userId - Identifiant de l'utilisateur
     * @param userToFollowId - Identifiant de l'utilisateur à suivre
     * @returns L'utilisateur mis à jour
     */
    public static async followUser(userId: string, userToFollowId: string): Promise<IUser | null> {
        return (
            UserModel.findByIdAndUpdate(userId, { $push: { followings: userToFollowId } }, { new: true }),
            UserModel.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true })
        );
    }

    /**
     * Retire un utilisateur des abonnements d'un autre utilisateur
     * @param userId - Identifiant de l'utilisateur
     * @param userToUnfollowId - Identifiant de l'utilisateur à ne plus suivre
     * @returns L'utilisateur mis à jour
     */
    public static async unfollowUser(userId: string, userToUnfollowId: string): Promise<IUser | null> {
        return (
            UserModel.findByIdAndUpdate(userId, { $pull: { followings: userToUnfollowId } }, { new: true }),
            UserModel.findByIdAndUpdate(userToUnfollowId, { $pull: { followers: userId } }, { new: true })
        );
    }
}

export default UserRepository;
