import PostModel from '../models/PostModel.js';
import UserModel from '../models/UserModel.js';

//get a post
export const getPost = async (req, res) => {
    try {
        const post = await PostModel.findOne({ userId: req.params.userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

//create a post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json({message: "Post Creating failed"});
    }
};

//update a post
export const updatePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({message: "the post has been updated"});
        } else {
            res.status(403).json({message: "you can update only your post"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

//delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json({message: "the post has been deleted"});
        } else {
            return res.status(403).json({message: "you can delete only your post"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// like/dislike a post
export const likePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

//get all posts from user and followings
export const getFriendsPosts = async (req, res) => {
    try {
        const currentUser = await UserModel.findOne({ _id: req.params.id });
        const userPosts = await PostModel.find({ userId: currentUser._id }).sort({createdAt: -1});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
};

//get user posts
export const getUserPosts = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.id });
        const posts = await PostModel.find({ userId: user._id }).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};