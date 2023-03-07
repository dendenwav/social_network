import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as InterfacesApi from '../api/_interfaces';
import * as Interfaces from './_interfaces';
import * as Api from '../api/api';


export const RegisterUser = async (
        newUser: InterfacesApi.IRegisterUser,
        dispatch?: Dispatch<Interfaces.IAuthAction>,
        enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey
    ) => {
    try {
        const { data } = await Api.registerUser(newUser);
        if (dispatch) dispatch({ type: AUTH, userId: data.userId });
        if (enqueueSnackbar) enqueueSnackbar(data.message, { variant: 'success' }, );
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        if (enqueueSnackbar) enqueueSnackbar('Une erreur est survenue lors de la création de votre compte.', { variant: 'error' }, );
    }
};

export const LoginUser = async (
        existingUser: InterfacesApi.IUser,
        dispatch?: Dispatch<Interfaces.IAuthAction>,
        enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey
    ) => {
    try {
        const { data } = await Api.loginUser(existingUser);
        console.log(data);
        if (dispatch) dispatch({ type: AUTH, userId: data.userId });        
        if (enqueueSnackbar) enqueueSnackbar(data.message, { variant: 'success' }, );
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        if (enqueueSnackbar) enqueueSnackbar('Une erreur est survenue lors de la connexion.', { variant: 'error' }, );
    }
};

export const LogoutUser = async (
        dispatch?: Dispatch<Interfaces.IAuthAction>,
        enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey
    ) => {
    try {
        const { data } = await Api.logoutUser();
        if (dispatch) dispatch({ type: LOGOUT });
        if (enqueueSnackbar) enqueueSnackbar(data.message, { variant: 'success' }, );
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        if (enqueueSnackbar) enqueueSnackbar('Une erreur est survenue lors de la déconnexion.', { variant: 'error' }, );
    }
};

export const CheckAuth = async (    
        dispatch?: Dispatch<Interfaces.IAuthAction>,
        enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject | undefined) => SnackbarKey
    ) => {
    try {
        const { data } = await Api.checkAuth();

        if (dispatch) dispatch({ type: AUTH, userId: data.userId });
        if (enqueueSnackbar) enqueueSnackbar(data.message, { variant: 'success' }, );
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        if (dispatch) dispatch({ type: LOGOUT });
        if (enqueueSnackbar) enqueueSnackbar('Une erreur est survenue lors de la vérification de connexion. Veuillez vous reconnecter.', { variant: 'error' }, );
    }
};