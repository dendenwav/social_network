import { AUTH, LOGOUT } from '../constants/actionTypes';

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH:
            return {
                ...state,
                isAuthenticated: true,
                user: action.user,
                error: null
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            };
        default:
            return state;
    }
};

export default authReducer;
