import { AUTH, LOGOUT } from '../constants/actionTypes';

const initialState = {
    userId: null
}

const authReducer = (state = initialState, action) => {
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
                userId: null 
            };
        default:
            return state;
    }
};

export default authReducer;
