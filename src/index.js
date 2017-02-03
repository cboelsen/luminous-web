import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
// import {IndexRedirect, Router, Route, browserHistory} from 'react-router';
import {Router, browserHistory} from 'react-router';

import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Raven from 'raven-js';
import RavenMiddleware from 'redux-raven-middleware';

import luminousReducers from './reducers';

import App from './apps/App';


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

// render(
//     <Provider store={store}>
//         <Router history={browserHistory}>
//             <Route path="/" component={App}>
//                 <IndexRedirect to="/slideshow/" />
//                 <Route path="rename/" component={RenameApp} />
//                 <Route path="slideshow/" component={SlideshowApp} />
//             </Route>
//         </Router>
//     </Provider>,
//     document.getElementById('root')
// );

function errorLoading(err) {
    console.error('Dynamic page loading failed', err);
}

function loadRoute(cb) {
    return (module) => cb(null, module.default);
}

const routes = {
    component: App,
    path: '/',
    indexRoute: {
        getComponent(location, cb) {
            System.import('./apps/SlideshowApp')
                .then(loadRoute(cb))
                .catch(errorLoading);
        }
    },
    childRoutes: [
        {
            path: 'rename/',
            getComponent(location, cb) {
                System.import('./apps/RenameApp')
                    .then(loadRoute(cb))
                    .catch(errorLoading);
            }
        },
    ]
};

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
);
