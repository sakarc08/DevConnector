import { CLEAR_PROFILE, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from './types'
import axios from 'axios';
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'

export const loadUser = () => async dispatch => {
    if(localStorage.token) setAuthToken(localStorage.token)
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

    } catch (error) {
        console.log(error.message)
        dispatch({
            type: AUTH_ERROR
        })
    }
} 


export const registerUser = ({ name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'content-type': "application/json"
        }
    }

    const body = JSON.stringify({ name, email, password});
    try {
        const res = await axios.post('/api/users/register', body, config);
        
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (error) {
        console.log(error.message);
        const errors = error.response.data.errors;

        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.message, 'danger'))
            });
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}

export const login = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'content-type': "application/json"
        }
    }
    const body = JSON.stringify({ email, password});
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser());
    } catch (error) {
        console.log(error.message);
        const errors = error.response.data.errors;

        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.message, 'danger'))
            });
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }     
}

export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE})
    dispatch({ type: LOGOUT})
}