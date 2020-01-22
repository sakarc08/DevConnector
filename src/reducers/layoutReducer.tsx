
import { IState, IAction } from '../@types/initialTypes';

export const initialState:IState = {
    counter: 0
};

export const layoutReducer = (state: IState = initialState, action: IAction) => {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, counter: state.counter + 1 }  
        case 'DECREMENT':
            return { ...state, counter: state.counter - 1 }
        default:
            return { ...state }
    }
}