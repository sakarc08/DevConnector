import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Thunk from 'redux-thunk'
import appReducers from './reducers'

const initialState = {};
const middlewares = [Thunk];


export default createStore(appReducers, initialState, composeWithDevTools(applyMiddleware(...middlewares)))