import { AxiosError } from 'axios';

import { IUser } from '../../../server/src/models/_interfaces/UserInterfaces';
import * as Api from '../api/api';

export const getUser = async (pseudo: string) => {
    try {
        const user: IUser = { pseudo };
        const { data } = await Api.getUser(user);
        console.log(data);
        return data;
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        return null;
    }
};

export const getUsers = async () => {
    try {
        const { data } = await Api.getUsers();
        return data;
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        return null;
    }
}