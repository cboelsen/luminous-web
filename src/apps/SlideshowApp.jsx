import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
    addPhotosToQueue,
    reloadPhotoQueue,
    listenToWindowEvent,
    startSlideshow,
    updatePhotoFilters,
} from '../actions';

import {dispatchify} from '../utils';


export class SlideshowApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {removeEventListeners: []};
    }


    componentWillMount() {
        this.props.updatePhotoFilters();
        this.props.addPhotosToQueue();
        this.props.startSlideshow();

        this.setState({removeEventListeners: [
            this.props.listenToWindowEvent('orientationchange', reloadPhotoQueue),
        ]});
    }

    componentWillUnmount() {
        for (const removeFn of this.state.removeEventListeners) {
            removeFn();
        }
    }

    render = () => {
        return (
            <div>
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
