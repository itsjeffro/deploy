import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducers from './state/rootReducers';
import Application from './Application';

if (document.getElementById('app')) {
  const store = createStore(
    rootReducers,
    applyMiddleware(thunk)
  );

  render(
    <Provider store={ store }>
      <Application />
    </Provider>,
    document.getElementById('app')
  )
}
