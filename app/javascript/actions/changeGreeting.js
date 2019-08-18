import { CHANGE_GREETING } from '../actionTypes';

export const changeGreeting = (greeting) => dispatch => {
    // Do some actions
    dispatch({
        type: CHANGE_GREETING,
        payload: greeting,
    });
}