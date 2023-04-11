import axios from 'axios';
import * as PostsInterfaces from '../../../server/src/models/_interfaces/PostsInterfaces';
import { IUser, ILoginUser, IRegisterUser } from '../../../server/src/models/_interfaces/UsersInterfaces';

const apiBaseURL = 'http://localhost:5000';

const API = axios.create({ baseURL: apiBaseURL});

const postRoot = '/posts';

export const getPosts = () => API.get(`${postRoot}`);
export const getPost = (post: PostsInterfaces.IPost) => API.get(`${postRoot}/${post.postId}`);
export const getUserPosts = (user: IUser) => API.get(`${postRoot}/user/${user.pseudo}`);
export const getFriendsPosts = (user: IUser) => API.get(`${postRoot}/friends/${user.pseudo}`);
export const createPost = (newPost: PostsInterfaces.IPost) => API.post(`${postRoot}`, newPost, { withCredentials: true });
export const updatePost = (updatedPost: PostsInterfaces.IPost) => API.put(`${postRoot}`, updatedPost, { withCredentials: true });
export const deletePost = (postToDelete: PostsInterfaces.IPost) => API.delete(`${postRoot}/${postToDelete.postId}`, { withCredentials: true });
export const likePost = (postToLike: PostsInterfaces.IPost) => API.put(`${postRoot}/like`, postToLike, { withCredentials: true });

const userRoot = '/users';

export const getUsers = () => API.get(`${userRoot}`);
export const getUser = (user: IUser) => API.get(`${userRoot}/${user.pseudo}`);
export const updateUser = (updatedUser: IUser) => API.put(`${userRoot}/`, updatedUser, { withCredentials: true });
export const deleteUser = (userToDelete: IUser) => API.delete(`${userRoot}/${userToDelete.pseudo}`, { withCredentials: true });
export const followUser = (userToFollow: IUser) => API.put(`${userRoot}/follow/${userToFollow.pseudo}`, { withCredentials: true });
export const unfollowUser = (userToUnfollow: IUser) => API.put(`${userRoot}/unfollow/${userToUnfollow.pseudo}`, { withCredentials: true });

const authRoot = '/auth';

export const registerUser = (newUser: IRegisterUser) => API.post(`${authRoot}/register`, newUser, { withCredentials: true });
export const loginUser = (existingUser: ILoginUser) => API.post(`${authRoot}/login`, existingUser, { withCredentials: true });
export const checkAuth = () => API.get(`${authRoot}/`, { withCredentials: true });
export const logoutUser = () => API.get(`${authRoot}/logout`, { withCredentials: true });