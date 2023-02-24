import { AxiosError } from 'axios';
import { Dispatch } from 'react';

import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as InterfacesApi from '../api/_interfaces';
import * as Interfaces from './_interfaces';
import * as Api from '../api/api';

export const registerUser = async (newUser: InterfacesApi.IRegisterUser, dispatch: Dispatch<Interfaces.IAuthAction>) => {
    try {
        const { data } = await Api.registerUser(newUser);

        dispatch({ type: AUTH, userId: data.user.pseudo });
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
    }
};

export const loginUser = async (existingUser: InterfacesApi.IUser, dispatch: Dispatch<Interfaces.IAuthAction>) => {
    try {
        const { data } = await Api.loginUser(existingUser);

        dispatch({ type: AUTH, userId: data.user.pseudo });
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
    }
};

export const checkAuth = async (dispatch: Dispatch<Interfaces.IAuthAction>) => {
    try {
        const { data } = await Api.checkAuth();

        if (data) {
            dispatch({ type: AUTH, userId: data.pseudo });
        }
        else {
            dispatch({ type: LOGOUT });
        }
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        dispatch({ type: LOGOUT });
        return error;
    }
};