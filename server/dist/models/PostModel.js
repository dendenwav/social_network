"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        max: 500,
    },
    selectedFile: {
        type: String
    },
    tags: {
        type: [String],
    },
    likes: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
const PostModel = mongoose_1.default.model('Post', PostSchema);
exports.default = PostModel;
