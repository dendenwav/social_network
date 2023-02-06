import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
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
      type: [String]
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