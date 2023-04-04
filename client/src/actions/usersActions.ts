import { AxiosError } from 'axios';

import * as InterfacesApi from '../api/_interfaces';
import * as Api from '../api/api';


export const getUser = async (userId: string) => {
    try {
        const user: InterfacesApi.IUser = { userId };
        const { data } = await Api.getUser(user);
        console.log(data);
        return data;
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        return null;
    }
};