import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import reduxStore from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={reduxStore}>
    <Router>
      <App />
    </Router>
  </Provider>,
);
