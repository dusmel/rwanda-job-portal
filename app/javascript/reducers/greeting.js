import initialState from '../store/initialState';
import {
    CHANGE_GREETING
} from '../actionTypes';

const greeting = (state = initialState, { type, payload }) => {

    switch (type) {
        case CHANGE_GREETING:
            return {
                ...state,
                greet: payload
            }
        default:
            return state;
    }
};

export default greeting;