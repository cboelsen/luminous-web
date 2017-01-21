import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {photoImageUrl, dispatchify} from '../utils'

import {showMenus, hideMenus} from '../actions'

import './PhotoBackground.css';


const PhotoBackground = ({photo, visible, showMenus, hideMenus}) => {
    if (photo === null)
        return <span />;
    const onClickFn = visible ? showMenus : hideMenus;
    const backgroundImage = "url('" + photoImageUrl(photo) + "')";
    const opacity = visible ? 0.0 : 0.5;
    return (
        <div className="photobg" style={{backgroundImage}} onClick={onClickFn}>
            <div className="overlay" style={{opacity}} />
        </div>
    );
};


PhotoBackground.propTypes = {
    photo: PropTypes.object,
    visible: PropTypes.bool,
    showMenus: PropTypes.func,
    hideMenus: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        visible: state.visibility.photoBackground
    }
};


const mapDispatchToProps = dispatchify(
    showMenus,
    hideMenus,
);


const PhotoBackgroundContainer = connect(mapStateToProps, mapDispatchToProps)(PhotoBackground);


export default PhotoBackgroundContainer;
