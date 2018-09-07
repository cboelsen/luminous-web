import './PhotoBackground.css';

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {VelocityComponent} from 'velocity-react'

import {photoImageUrl, dispatchify} from '../utils'

import {showMenus, hideMenus, nextPhoto, previousPhoto} from '../actions'

import Hammer from 'hammerjs';
import HammerComponent from 'react-hammerjs';


const showFullAnimation = {opacity: 1.0};
const showHalfAnimation = {opacity: 0.5};
const hideAnimation = {opacity: 0.0};


const PhotoDiv = ({photo, zIndex, visible}) => {
    if (photo === null) {
        return <span />
    }
    const backgroundImage = `url(${photoImageUrl(photo)})`;
    return (
        <VelocityComponent animation={visible ? showFullAnimation : hideAnimation} duration={500}>
            <div className="photobg" style={{backgroundImage, zIndex}} />
        </VelocityComponent>
    );
};


export class PhotoBackground extends React.Component {
    onSwipe = (event) => {
        switch (event.direction) {
            case Hammer.DIRECTION_LEFT:
                this.props.nextPhoto();
                break;
            case Hammer.DIRECTION_RIGHT:
                this.props.previousPhoto();
                break;
            default:
                break;
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const eachPhotoSame = this.props.photos.map((p, i) => p === nextProps.photos[i]);
        const allPhotosSame = eachPhotoSame.every((b) => b);
        return (
            !allPhotosSame ||
            this.props.currentPhoto !== nextProps.currentPhoto ||
            this.props.showOverlay !== nextProps.showOverlay
        );
    }

    render = () => {
        const {photos, currentPhoto, showOverlay, showMenus, hideMenus} = this.props;
        const onClickFn = showOverlay ? hideMenus : showMenus;
        const spinner = (currentPhoto === null)
            ? <img className="centered" alt="" role="presentation" src='/images/spinner.gif' /> 
            : <span />;

        const photoTags = photos.map((p, i) => {
            return <PhotoDiv key={p && p.url} photo={p} zIndex={(i * -1) - 2} visible={p === currentPhoto} />;
        });

        return (
            <HammerComponent onSwipe={this.onSwipe} onClick={onClickFn}>
                <div className="container">
                    {spinner}
                    {photoTags}
                    <VelocityComponent animation={showOverlay ? showHalfAnimation : hideAnimation} duration={100}>
                        <div className="overlay" />
                    </VelocityComponent>
                </div>
            </HammerComponent>
        );
    }
};


PhotoBackground.propTypes = {
    photos: PropTypes.array,
    currentPhoto: PropTypes.object,
    showOverlay: PropTypes.bool,
    showMenus: PropTypes.func,
    hideMenus: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photos: state.photos.prev.slice(-2).concat([state.photos.current].concat(state.photos.next.slice(0, 2))),
        currentPhoto: state.photos.current,
        showOverlay: !state.visibility.photoBackground,
    }
};


const mapDispatchToProps = dispatchify({
    showMenus,
    hideMenus,
    nextPhoto,
    previousPhoto,
});


const PhotoBackgroundContainer = connect(mapStateToProps, mapDispatchToProps)(PhotoBackground);


export default PhotoBackgroundContainer;
