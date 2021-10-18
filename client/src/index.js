import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';
import Router from './routes/Router';

import 'antd/dist/antd.css';
import './index.css';

const init = configureStore({});

ReactDOM.render(
  <Provider store={init.store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
