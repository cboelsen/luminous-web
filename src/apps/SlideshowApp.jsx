import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
    addPhotosToQueue,
    startSlideshow,
    updatePhotoFilters,
} from '../actions';

import {dispatchify} from '../utils';


export class SlideshowApp extends React.Component {

    componentWillMount() {
        this.props.updatePhotoFilters();
        this.props.addPhotosToQueue();
        this.props.startSlideshow();
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
    startSlideshow: PropTypes.func,
    updatePhotoFilters: PropTypes.func,
};


const mapDispatchToProps = dispatchify(
    addPhotosToQueue,
    startSlideshow,
    updatePhotoFilters,
);


const SlideshowAppContainer = connect(() => {return {};}, mapDispatchToProps)(SlideshowApp);


export default SlideshowAppContainer;
