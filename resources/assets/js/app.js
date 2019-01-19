import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './bootstrap';

import rootReducers from './reducers';
import Application from './Application';

if (document.getElementById('app')) {
  const store = createStore(rootReducers);

  render(
    <Provider store={store}>
      <Application />
    </Provider>,
    document.getElementById('app')
  )
}