import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';

import thunk from 'redux-thunk';
import Raven from 'raven-js';
import RavenMiddleware from 'redux-raven-middleware';

import constants from './constants';
import luminousReducers from './reducers';

import App from './apps/App';
import RenameApp from './apps/RenameApp';
import SlideshowApp from './apps/SlideshowApp';


const sentry_dsn = 'https://c49ae17dec2049b3ad57b67639f44a63@sentry.boelsen.net/3';
Raven.config(sentry_dsn).install();

let middleware = [thunk, RavenMiddleware(sentry_dsn)];
if (constants.IS_DEV) {
    const createLogger = require('redux-logger');
    const logger = createLogger();
    middleware.push(logger);
}

const store = createStore(
    luminousReducers,
    applyMiddleware(...middleware)
);

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={SlideshowApp} />
                <Route path="rename/" component={RenameApp} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
