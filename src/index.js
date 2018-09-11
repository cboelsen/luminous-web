import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
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
//Raven.config(sentry_dsn).install();

let middleware = [thunk];//, RavenMiddleware(sentry_dsn)];
if (constants.IS_DEV) {
    const logger = require('redux-logger');
    middleware.push(logger.logger);
}

const store = createStore(
    luminousReducers,
    applyMiddleware(...middleware)
);



class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}



render(
    <Provider store={store}>
        <BrowserRouter>
            <ErrorBoundary>
                <App>
                    <Switch>
                        <Route path="/" component={SlideshowApp} />
                        <Route path="rename/" component={RenameApp} />
                    </Switch>
                </App>
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);


document.documentElement.style.overflow = 'hidden';
