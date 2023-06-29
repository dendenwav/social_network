import { AxiosError } from 'axios';

import { IUser } from '../../../server/src/models/_interfaces/UserInterfaces';
import * as Api from '../api/api';

export const getFriendsPosts = async (pseudo: string) => {
    try {
        const user: IUser = { pseudo };
        const { data } = await Api.getFriendsPosts(user);
        console.log(data);
        return data;
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
        return null;
    }
};