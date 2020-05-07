import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR } from './types'


export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        console.log(error.message);
        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    const config = {
        headers: {
            'content-type': "application/json"
        }
    }

    try {
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated' : ' Profile Created', 'success'));
        //if(!edit) {
            history.push('/dashboard');
        //}
    } catch (error) {
        console.log(error.message);
        const errors = error.response.data.errors;

        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { message: error.response.statusText, status: error.response.status }
        })
    }
}