import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Raven from 'raven-js';
import RavenMiddleware from 'redux-raven-middleware';

import luminousReducers from './reducers';
import { addRandomPhoto, startSlideshow } from './actions';

import App from './components/App';


const sentry_dsn = 'http://c49ae17dec2049b3ad57b67639f44a63@sentry.boelsen.net/3';

Raven.config(sentry_dsn).install();

const logger = createLogger();

const store = createStore(
    luminousReducers,
    applyMiddleware(
        thunk,
        RavenMiddleware(sentry_dsn),
        logger
    )
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);


store.dispatch(addRandomPhoto());
store.dispatch(startSlideshow());
