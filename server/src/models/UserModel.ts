import mongoose from "mongoose";
import { IUser } from "./_interfaces/UserInterfaces";

const UserSchema = new mongoose.Schema<IUser>(
    { pseudo: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        min: 3,
        max: 25,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    importedPics: {
        type: [String],
        default: [],
    },
    followers: {
        type: [String],
        default: [],
    },
    followings: {
        type: [String],
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50,
    },
    city: {
        type: String,
        max: 50,
    },
    from: {
        type: String,
        max: 50,
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3],
    } },
    { timestamps: true }
);

const UserModel =  mongoose.model('User', UserSchema);

export default UserModel;
