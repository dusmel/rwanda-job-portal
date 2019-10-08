import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FETCH_PROFILE,
  UPDATE_PROFILE,
  GET_APPLICATIONS,
  GET_ALL_USERS,
  SUSPEND_ACCOUNT,
  COMPANY_APPLICATIONS,
} from '../actionTypes';

export const fetchProfile = () => dispatch => {
  // Do some actions
  axios
    .get('/profile')
    .then(response => {
      const { user, company } = response.data;
      if (company) {
        dispatch({
          type: FETCH_PROFILE,
          payload: { ...user, company: company.id },
        });
      } else {
        dispatch({
          type: FETCH_PROFILE,
          payload: user,
        });
      }
    })
    .catch(error => console.log(error));
};

export const updateProfile = (form, id) => dispatch => {
  // Do some actions
  axios
    .put('/profile', { profile: { ...form, first_time: false }, id })
    .then(response => {
      const { message, user: payload } = response.data;
      dispatch({
        type: UPDATE_PROFILE,
        payload,
      });
      toast.success(message);
    })
    .catch(error => console.log(error));
};

export const applyJob = (userId, jobId) => () => {
  // Do some actions
  try {
    axios
      .post('/job/apply', { application: { user_id: userId, job_id: jobId } })
      .then(response => {
        const { message } = response.data;
        toast.success(message);
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          toast('Login first');
          // window.location.pathname = '/auth/login';
        }
      });
  } catch (error) {
    console.log(error);
  }
};

export const jobApplications = () => dispatch => {
  // Do some actions
  try {
    axios
      .get('/job/my-applications')
      .then(response => {
        const { jobs: payload } = response.data;
        dispatch({
          type: GET_APPLICATIONS,
          payload,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const getAllUsers = () => dispatch => {
  // Do some actions
  try {
    axios
      .get('/profile/all')
      .then(response => {
        const { users: payload } = response.data;
        dispatch({
          type: GET_ALL_USERS,
          payload,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const companyApplications = id => dispatch => {
  // Do some actions
  try {
    axios
      .get(`/job/applications/company/${id}`)
      .then(response => {
        console.log('response:', response);
        const payload = response.data;
        dispatch({
          type: COMPANY_APPLICATIONS,
          payload,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const suspendAccount = id => dispatch => {
  // Do some actions
  try {
    axios
      .put('/profile/suspend', { id })
      .then(response => {
        const { user: payload, message } = response.data;
        dispatch({
          type: SUSPEND_ACCOUNT,
          payload,
        });
        if (payload.suspend) {
          toast.error(message);
        } else {
          toast.success(message);
        }
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};
