import * as api from '../api/api';
import { AUTH, LOGOUT } from '../constants/actionTypes';


export const registerUser = (newUser, navigate) => async (dispatch) => {
    try {
        const { data } = await api.registerUser(newUser);

        dispatch({ type: AUTH, userId: data.user.pseudo });
        
        navigate('/');
    } catch (error) {
        console.log(error.response.data.message);
    }
};

export const loginUser = (existingUser, navigate) => async (dispatch) => {
    try {
        const { data } = await api.loginUser(existingUser);

        dispatch({ type: AUTH, userId: data.user.pseudo });

        navigate('/');
    } catch (error) {
        console.log(error.response.data.message);
    }
};

export const checkAuth = () => async (dispatch) => {
    try {
        const { data } = await api.checkAuth();

        if (data) {
            dispatch({ type: AUTH, userId: data.pseudo });
        }
        else {
            dispatch({ type: LOGOUT });
        }
    } catch (error) {
        console.log(error.response.data.message);
        dispatch({ type: LOGOUT });
        return error;
    }
};