import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {loadSettings, listenToWindowEvent, showNavigation} from '../actions';
import {dispatchify, debounce} from '../utils';

import AlertList from '../containers/AlertList';
import PhotoBackground from '../containers/PhotoBackground';
import PhotoNavigation from '../containers/PhotoNavigation';


export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {removeEventListeners: []};
    }

    componentWillMount = () => {
        this.props.loadSettings();
        this.setState((state) => (
            {removeEventListeners: state.removeEventListeners.concat([
                // this.props.listenToWindowEvent('mousemove', debounce(showNavigation)),
                // this.props.listenToWindowEvent('mousedown', debounce(showNavigation)),
                // this.props.listenToWindowEvent('touchstart', debounce(showNavigation)),
                this.props.listenToWindowEvent('mousemove', showNavigation),
                this.props.listenToWindowEvent('mousedown', showNavigation),
                this.props.listenToWindowEvent('touchstart', showNavigation),
            ])}
        ));
    }

    componentWillUnmount = () => {
        for (const removeFn of this.state.removeEventListeners) {
            removeFn();
        }
    }

    shouldComponentUpdate = () => {
        return false;
    }

    render = () => {
        return (
            <div>
                <PhotoBackground />
                {this.props.children}
                <PhotoNavigation />
                <AlertList />
            </div>
        );
    }
}


App.propTypes = {
    loadSettings: PropTypes.func,
    listenToWindowEvent: PropTypes.func,
};


const mapDispatchToProps = dispatchify({
    loadSettings,
    listenToWindowEvent,
});


const AppContainer = connect(() => {return {};}, mapDispatchToProps)(App);


export default AppContainer;
