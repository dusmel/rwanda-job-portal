import initialState from '../store/initialState';
import {
  FETCH_PROFILE,
  GET_ALL_COMPANY_JOBS,
  CREATE_JOB,
  UPDATE_PROFILE,
  GET_APPLICATIONS,
  GET_ALL_USERS,
  SUSPEND_ACCOUNT,
  COMPANY_APPLICATIONS,
} from '../actionTypes';

const profile = (state = initialState.profile, { type, payload }) => {
  switch (type) {
    case FETCH_PROFILE:
      return {
        ...state,
        ...payload,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        ...payload,
      };
    case GET_ALL_COMPANY_JOBS:
      return {
        ...state,
        jobs: payload,
      };
    case CREATE_JOB:
      return {
        ...state,
        jobs: [payload, ...state.jobs],
      };
    case GET_APPLICATIONS:
      return {
        ...state,
        applications: payload,
      };
    case GET_ALL_USERS:
      return {
        ...state,
        users: payload,
      };
    case SUSPEND_ACCOUNT:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === payload.id) {
            user.suspended = payload.suspended;
          }
          return user;
        }),
      };
    case COMPANY_APPLICATIONS:
      return {
        ...state,
        AllcompanyApplications: payload,
      };
    default:
      return state;
  }
};

export default profile;
