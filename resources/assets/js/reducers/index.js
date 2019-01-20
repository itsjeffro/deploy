import { combineReducers } from 'redux';

import alert from './alert';
import project from './project';

export default combineReducers({
  alert,
  project
});