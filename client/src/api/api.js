import axios from 'axios';

const apiBaseURL = 'http://localhost:5000';

const API = axios.create({ baseURL: apiBaseURL});

const postRoot = '/posts';

export const getPosts = () => API.get(`${postRoot}`);
export const getPost = (postId) => API.get(`${postRoot}/${postId}`);
export const getUserPosts = (userId) => API.get(`${postRoot}/user/${userId}`);
export const getFriendsPosts = (userId) => API.get(`${postRoot}/friends/${userId}`);
export const createPost = (newPost) => API.post(`${postRoot}`, newPost, { withCredentials: true });
export const updatePost = (updatedPost) => API.put(`${postRoot}`, updatedPost, { withCredentials: true });
export const deletePost = (postToDelete) => API.delete(`${postRoot}`, postToDelete, { withCredentials: true });
export const likePost = (postToLike) => API.put(`${postRoot}/like`, postToLike, { withCredentials: true });

const userRoot = '/users';

export const getUsers = () => API.get(`${userRoot}`);
export const getUser = (userId) => API.get(`${userRoot}/${userId}`);
export const updateUser = (updatedUser) => API.put(`${userRoot}/`, updatedUser, { withCredentials: true });
export const deleteUser = (userToDelete) => API.delete(`${userRoot}/`, userToDelete, { withCredentials: true });
export const followUser = (userToFollow) => API.put(`${userRoot}/follow`, userToFollow, { withCredentials: true });
export const unfollowUser = (userToUnfollow) => API.put(`${userRoot}/unfollow`, userToUnfollow, { withCredentials: true });

const authRoot = '/auth';

export const registerUser = (newUser) => API.post(`${authRoot}/register`, newUser, { withCredentials: true });
export const loginUser = (existingUser) => API.post(`${authRoot}/login`, existingUser, { withCredentials: true });
export const checkAuth = () => API.get(`${authRoot}/`, { withCredentials: true });