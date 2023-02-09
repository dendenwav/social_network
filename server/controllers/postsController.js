import PostModel from '../models/PostModel.js';
import UserModel from '../models/UserModel.js';

//get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({});        
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve all post." });
    }
};

//get a post
export const getPost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById({ postId });
        
        if (!post) return res.status(404).json({ error: "Post not found." });
        
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve post." });
    }
};

//get user's posts
export const getUserPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findOne({ pseudo: userId });

        if (!user) return res.status(404).json({ error: "User not found." });

        const posts = await PostModel.find({ userId: user.pseudo }).sort({createdAt: -1});
        
        if (!posts) return res.status(404).json({ error: "User's posts not found." });

        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's posts." });
    }
};

//get all posts from user and followings
export const getFriendsPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const currentUser = await UserModel.findOne({ pseudo: userId });

        if (!currentUser) return res.status(404).json({ error: "User not found." });

        const userPosts = await PostModel.find({ userId: currentUser.pseudo }).sort({createdAt: -1});

        if (!userPosts) return res.status(404).json({ error: "User's posts not found." });

        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return PostModel.find({ userId: friendId });
            })
        );

        if (!friendPosts) return res.status(404).json({ error: "User's friends posts not found." });

        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not retrieve user's friends posts." });
    }
};

//create a post
export const createPost = async (req, res) => {    
    try {
        const currentUser = await UserModel.findOne({ pseudo: req.user?.pseudo });

        if (!currentUser) return res.status(400).json({ message: "User not found." });

        const newPost = await PostModel.create(req.body);

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: "Error during post creation."});
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