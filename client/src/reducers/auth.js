import { LOGOUT, LOGIN_SUCCESS , LOGIN_FAIL, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, ACCOUNT_DELETED } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return { ...state, isAuthenticated: true, loading: false, ...payload }

        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false }
        case REGISTER_FAIL:
        case LOGOUT:
        case ACCOUNT_DELETED:
        case LOGIN_FAIL:
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false, loading: false }
        
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return { ...state, ...payload, isAuthenticated: true, loading: false}
        
        default:
            return state
    }
}

export default authReducer