import axios from 'axios';

const apiBaseURL = 'http://localhost:5000';

const API = axios.create({ baseURL: apiBaseURL});
const securedAPI = axios.create({ baseURL: apiBaseURL});

securedAPI.interceptors.request.use((req) => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('Authorization='));

    if (cookie) {
        console.log(cookie.split('=')[1]);
        req.headers.Authorization = cookie.split('=')[1];
    }

    return req;
});

const postRoot = '/posts';

export const getPosts = () => API.get(`${postRoot}`);
export const getPost = (postId) => API.get(`${postRoot}/${postId}`);
export const getUserPosts = (userId) => API.get(`${postRoot}/user/${userId}`);
export const getFriendsPosts = (userId) => API.get(`${postRoot}/friends/${userId}`);
export const createPost = (newPost) => securedAPI.post(`${postRoot}`, newPost);
export const updatePost = (updatedPost) => securedAPI.put(`${postRoot}`, updatedPost);
export const deletePost = (postToDelete) => securedAPI.delete(`${postRoot}`, postToDelete);
export const likePost = (postToLike) => securedAPI.put(`${postRoot}/like`, postToLike);

const userRoot = '/users';

export const getUsers = () => API.get(`${userRoot}`);
export const getUser = (userId) => API.get(`${userRoot}/${userId}`);
export const updateUser = (updatedUser) => securedAPI.put(`${userRoot}/`, updatedUser);
export const deleteUser = (userToDelete) => securedAPI.delete(`${userRoot}/`, userToDelete);
export const followUser = (userToFollow) => securedAPI.put(`${userRoot}/follow`, userToFollow);
export const unfollowUser = (userToUnfollow) => securedAPI.put(`${userRoot}/unfollow`, userToUnfollow);

const authRoot = '/auth';

export const registerUser = (newUser) => API.post(`${authRoot}/register`, newUser, { withCredentials: true });
export const loginUser = (existingUser) => API.post(`${authRoot}/login`, existingUser, { withCredentials: true });