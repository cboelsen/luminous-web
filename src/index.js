import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

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
    const logger = require('redux-logger');
    middleware.push(logger.logger);
}

const store = createStore(
    luminousReducers,
    applyMiddleware(...middleware)
);

render(
    <Provider store={store}>
        <BrowserRouter>
            <Route component={App}>
                <Route path="/" component={SlideshowApp} />
                <Route path="rename/" component={RenameApp} />
            </Route>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);


document.documentElement.style.overflow = 'hidden';
