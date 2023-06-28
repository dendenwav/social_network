import { IPost } from './_interfaces/PostsInterfaces';

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema<IPost>(
  {
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
  },
  { timestamps: true }
);

const PostModel =  mongoose.model('Post', PostSchema);

export default PostModel;