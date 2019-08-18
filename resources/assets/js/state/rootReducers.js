import { combineReducers } from 'redux';

import alert from './alert';
import project from './project';
import projects from './projects';

export default combineReducers({
  alert,
  project,
  projects
});