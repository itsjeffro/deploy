import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './bootstrap';

import rootReducers from './reducers';
import App from './components/App';

if (document.getElementById('dashboard')) {
  const store = createStore(rootReducers);

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('dashboard')
  )
}