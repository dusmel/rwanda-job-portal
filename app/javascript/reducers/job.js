import initialState from '../store/initialState';
import { GET_JOBS } from '../actionTypes';

const job = (state = initialState.jobs, { type, payload }) => {
  switch (type) {
    case GET_JOBS:
      return {
        ...state,
        jobs: payload,
      };
    default:
      return state;
  }
};

export default job;
