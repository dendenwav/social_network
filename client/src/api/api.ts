import axios from 'axios';
import * as Interfaces from './_interfaces';

const apiBaseURL = 'http://localhost:5000';

const API = axios.create({ baseURL: apiBaseURL});

const postRoot = '/posts';

export const getPosts = () => API.get(`${postRoot}`);
export const getPost = (post: Interfaces.IPost) => API.get(`${postRoot}/${post.postId}`);
export const getUserPosts = (user: Interfaces.IUser) => API.get(`${postRoot}/user/${user.pseudo}`);
export const getFriendsPosts = (user: Interfaces.IUser) => API.get(`${postRoot}/friends/${user.pseudo}`);
export const createPost = (newPost: Interfaces.IPost) => API.post(`${postRoot}`, newPost, { withCredentials: true });
export const updatePost = (updatedPost: Interfaces.IPost) => API.put(`${postRoot}`, updatedPost, { withCredentials: true });
export const deletePost = (postToDelete: Interfaces.IPost) => API.delete(`${postRoot}/${postToDelete.postId}`, { withCredentials: true });
export const likePost = (postToLike: Interfaces.IPost) => API.put(`${postRoot}/like`, postToLike, { withCredentials: true });

const userRoot = '/users';

export const getUsers = () => API.get(`${userRoot}`);
export const getUser = (user: Interfaces.IUser) => API.get(`${userRoot}/${user.pseudo}`);
export const updateUser = (updatedUser: Interfaces.IUser) => API.put(`${userRoot}/`, updatedUser, { withCredentials: true });
export const deleteUser = (userToDelete: Interfaces.IUser) => API.delete(`${userRoot}/${userToDelete.pseudo}`, { withCredentials: true });
export const followUser = (userToFollow: Interfaces.IUser) => API.put(`${userRoot}/follow/${userToFollow.pseudo}`, { withCredentials: true });
export const unfollowUser = (userToUnfollow: Interfaces.IUser) => API.put(`${userRoot}/unfollow/${userToUnfollow.pseudo}`, { withCredentials: true });

const authRoot = '/auth';

export const registerUser = (newUser: Interfaces.IRegisterUser) => API.post(`${authRoot}/register`, newUser, { withCredentials: true });
export const loginUser = (existingUser: Interfaces.IUser) => API.post(`${authRoot}/login`, existingUser, { withCredentials: true });
export const checkAuth = () => API.get(`${authRoot}/`, { withCredentials: true });
export const logoutUser = () => API.get(`${authRoot}/logout`, { withCredentials: true });