import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
    addPhotosToQueue,
    reloadPhotoQueue,
    listenToWindowEvent,
    startSlideshow,
    updatePhotoFilters,
} from '../actions';

import {dispatchify} from '../utils';

import SlidingMenu from '../containers/SlidingMenu';


export class SlideshowApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {removeEventListeners: []};
    }

    componentWillMount = () => {
        this.props.updatePhotoFilters();
        this.props.addPhotosToQueue();
        this.props.startSlideshow();

        this.setState((state) => (
            {removeEventListeners: state.removeEventListeners.concat([
                this.props.listenToWindowEvent('orientationchange', reloadPhotoQueue),
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
                <SlidingMenu />
                {this.props.children}
            </div>
        );
    }
}


SlideshowApp.propTypes = {
    addPhotosToQueue: PropTypes.func,
    listenToWindowEvent: PropTypes.func,
    startSlideshow: PropTypes.func,
    updatePhotoFilters: PropTypes.func,
};


const mapDispatchToProps = dispatchify({
    addPhotosToQueue,
    listenToWindowEvent,
    startSlideshow,
    updatePhotoFilters,
});


const SlideshowAppContainer = connect(() => {return {};}, mapDispatchToProps)(SlideshowApp);


export default SlideshowAppContainer;
