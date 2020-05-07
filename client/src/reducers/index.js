import { combineReducers } from 'redux';
import AlertReducer from './alert'
import AuthReducer from './auth';
import ProfileReducer from './profile';

export default combineReducers({
    alerts: AlertReducer,
    auth: AuthReducer,
    profile: ProfileReducer,
})