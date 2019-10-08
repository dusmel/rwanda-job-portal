import { combineReducers } from 'redux';
import profile from './profile';
import jobs from './job';

const reducers = combineReducers({ profile, jobs });

export default reducers;
