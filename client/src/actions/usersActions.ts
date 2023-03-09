import { AxiosError } from 'axios';
import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

import * as InterfacesApi from '../api/_interfaces';
import * as Api from '../api/api';


export const RegisterUser = async (userId: string) => {
    try {
        // const user: InterfacesApi.IUser = new InterfacesApi.IUser(userId);
        // const { data } = await Api.getUser(user);
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
    }
};