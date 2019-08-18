import { combineReducers } from 'redux';

import alertReducers from './alert/alertReducers';
import projectReducers from './project/projectReducers';
import projectsReducers from './projects/projectsReducers';

export default combineReducers({
  alert: alertReducers,
  project: projectReducers,
  projects: projectsReducers
});
