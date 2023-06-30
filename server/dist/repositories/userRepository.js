"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
class UserRepository {
    /**
     * Crée un nouvel utilisateur
     * @param userData - Données de l'utilisateur à créer
     * @returns L'utilisateur créé
     */
    static async createUser(userData) {
        const newUser = new UserModel_1.default(userData);
        return newUser.save();
    }
    /**
     * Récupère tous les utilisateurs
     * @param elementsToIgnored - Éléments à ignorer dans la récupération des utilisateurs
     * @returns Une liste de tous les utilisateurs
     */
    static async getUsers(elementsToIgnored) {
        return UserModel_1.default.find({}, elementsToIgnored);
    }
    /**
     * Récupère un utilisateur par son pseudo
     * @param pseudo - Pseudo de l'utilisateur
     * @param elementsToIgnored - Éléments à ignorer dans la récupération de l'utilisateur
     * @returns L'utilisateur correspondant au pseudo donné
     */
    static async getUserByPseudo(pseudo, elementsToIgnored) {
        return UserModel_1.default.findOne({ pseudo: pseudo }, elementsToIgnored);
    }
    /**
     * Récupère un utilisateur par son email
     * @param email - Email de l'utilisateur
     * @returns L'utilisateur correspondant à l'email donné
     */
    static async getUserByEmail(email) {
        return UserModel_1.default.findOne({ email: email });
    }
    /**
     * Met à jour un utilisateur existant
     * @param updatedUserData - Données mises à jour de l'utilisateur
     * @returns L'utilisateur mis à jour
     */
    static async updateUser(updatedUserData) {
        const resultUser = await UserModel_1.default.findByIdAndUpdate(updatedUserData._id, updatedUserData, { new: true });
        const emptyUser = {
            pseudo: "",
        };
        if (resultUser)
            return resultUser;
        return emptyUser;
    }
    /**
     * Supprime un utilisateur par son identifiant
     * @param userId - Identifiant de l'utilisateur à supprimer
     * @returns L'utilisateur supprimé
     */
    static async deleteUser(userId) {
        return UserModel_1.default.findByIdAndDelete(userId);
    }
    /**
     * Ajoute un utilisateur aux abonnements d'un autre utilisateur
     * @param userId - Identifiant de l'utilisateur
     * @param userToFollowId - Identifiant de l'utilisateur à suivre
     * @returns L'utilisateur mis à jour
     */
    static async followUser(userId, userToFollowId) {
        return (UserModel_1.default.findByIdAndUpdate(userId, { $push: { followings: userToFollowId } }, { new: true }),
            UserModel_1.default.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true }));
    }
    /**
     * Retire un utilisateur des abonnements d'un autre utilisateur
     * @param userId - Identifiant de l'utilisateur
     * @param userToUnfollowId - Identifiant de l'utilisateur à ne plus suivre
     * @returns L'utilisateur mis à jour
     */
    static async unfollowUser(userId, userToUnfollowId) {
        return (UserModel_1.default.findByIdAndUpdate(userId, { $pull: { followings: userToUnfollowId } }, { new: true }),
            UserModel_1.default.findByIdAndUpdate(userToUnfollowId, { $pull: { followers: userId } }, { new: true }));
    }
}
exports.default = UserRepository;
