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
    const postId = req.params.postId;
    try {
        const post = await PostModel.findById(postId);
        
        if (!post) return res.status(404).json({ error: "Post not found." });
        
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not retrieve post." });
    }
};

//get user's posts
export const getUserPosts = async (req, res) => {
    const userId = req.params.userId;
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
    const userId = req.params.userId;
    try {
        const user = await UserModel.findOne({ pseudo: userId });

        if (!user) return res.status(404).json({ error: "User not found." });

        const userPosts = await PostModel.find({ userId: user.pseudo }).sort({createdAt: -1});

        if (!userPosts) return res.status(404).json({ error: "User's posts not found." });

        const friendPosts = await Promise.all(
            user.followings.map((friendId) => {
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
    const { message, selectedFile, tags } = req.body;
    const userId = req.user?.pseudo;
    try {
        const newPost = await PostModel.create({ userId, message, selectedFile, tags });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: "Error during post creation."});
    }
};

//update a post
export const updatePost = async (req, res) => {
    const userId = req.user?.pseudo;
    try {
        const postToUpdate = await PostModel.findById(req.body._id);

        if (!postToUpdate) return res.status(404).json({ message: "Post not found." });

        if (postToUpdate.userId === userId) {

            const updates = {};
            for (const [key, value] of Object.entries(req.body)) {
                if (key !== "likes" && key !== "userId") {
                    updates[key] = value;
                }
            }

            await postToUpdate.updateOne({ $set: updates });
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
        const currentUser = await UserModel.findOne({ pseudo: req.user?.pseudo });
        const postToDelete = await PostModel.findById(req.body._id);

        if (!postToDelete) return res.status(404).json({ message: "Post not found." });

        if (postToDelete.userId === currentUser.pseudo || currentUser.isAdmin) {
            await postToDelete.deleteOne();
            res.status(200).json({message: "the post has been deleted"});
        } else {
            return res.status(403).json({message: "you can delete only your post"});
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
};

// like/dislike a post
export const likePost = async (req, res) => {
    const userId = req.user?.pseudo;
    try {
        const postToLike = await PostModel.findById(req.body._id);

        if (!postToLike) return res.status(404).json({ message: "Post not found." });

        if (!postToLike.likes.includes(userId)) {
            await postToLike.updateOne({ $push: { likes: userId } });
            res.status(200).json("The post has been liked");
        } else {
            await postToLike.updateOne({ $pull: { likes: userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred while liking the post" });
    }
};