import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as AuthActionsInterfaces from '../actions/_interfaces';

const initialState = {
    userId: null
}

const authReducer = (state = initialState, action: AuthActionsInterfaces.IAuthAction) => {
    switch (action.type) {
        case AUTH:
            console.log(AUTH);
            return { 
                ...state, 
                userId: action?.userId
            };
        case LOGOUT:
            console.log(LOGOUT);
            return { 
                ...state, 
                userId: ''
            };
        default:
            return state;
    }
};

export default authReducer;
