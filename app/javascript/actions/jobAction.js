import axios from 'axios';
import { toast } from 'react-toastify';
import { CREATE_JOB, GET_ALL_COMPANY_JOBS, GET_JOBS, ARCHIVE } from '../actionTypes';

export const createJob = (form, id) => dispatch => {
  // Do some actions
  try {
    axios
      .post('/job/new', { job: { ...form, company_id: id } })
      .then(response => {
        const { message, job: payload } = response.data;
        dispatch({
          type: CREATE_JOB,
          payload,
        });
        toast.success(message);
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyJobs = () => dispatch => {
  // Do some actions
  try {
    axios
      .get('/job/company/all')
      .then(response => {
        const { jobs: payload } = response.data;
        dispatch({
          type: GET_ALL_COMPANY_JOBS,
          payload,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const archiveJob = (jobId, userId) => dispatch => {
  // Do some actions
  try {
    axios
      .put('/job/archive', { id: jobId, user_id: userId })
      .then(response => {
        const { message, jobs: payload } = response.data;
        dispatch({
          type: GET_ALL_COMPANY_JOBS,
          payload,
        });
        toast.success(message, {
          autoClose: 700,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const getJobs = () => dispatch => {
  // Do some actions
  try {
    axios
      .get('/job/all')
      .then(response => {
        const { jobs: payload } = response.data;
        dispatch({
          type: GET_JOBS,
          payload,
        });
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};
