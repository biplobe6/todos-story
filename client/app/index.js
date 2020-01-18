import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'App';
import { store } from 'Root/store';
import { faviconLoader } from 'Root/loader';


const ReactApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)



faviconLoader('favicon.ico')


ReactDOM.render(
  <ReactApp />,
  document.getElementById('app')
)
