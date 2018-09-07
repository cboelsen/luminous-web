import 'font-awesome/css/font-awesome.min.css';
import './PhotoNavigation.css';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import 'velocity-animate'
import 'velocity-animate/velocity.ui'
import {VelocityTransitionGroup} from 'velocity-react'

import {Button, ButtonGroup} from 'reactstrap';

import FontAwesome from 'react-fontawesome';

import {nextPhoto, previousPhoto, rotatePhoto, ratePhoto} from '../actions';

import {dispatchify, toggleFullScreen} from '../utils';

import RatingStar from '../components/RatingStar';


const Animation = ({children}) => {
    const duration = 350;

    const enterAnimation = {
        animation: {opacity: 0.3},
        duration,
    };
    const leaveAnimation = {
        animation: {opacity: 0},
        duration,
    };

    return (
        <VelocityTransitionGroup enter={enterAnimation} leave={leaveAnimation}>
            {children}
        </VelocityTransitionGroup>
    );
};


export const PhotoNavigation = ({photo, visible, nextPhoto, previousPhoto, rotatePhoto, ratePhoto}) => {
    if (photo === null) {
        return <span />;
    }

    const rotateLeft = () => rotatePhoto(photo, 270);
    const rotateRight = () => rotatePhoto(photo, 90);

    return (
        <Animation>
            {visible ?
                (
                    <div>
                        <div className='prevNavButton'>
                            <Button className="fullHeight" onClick={previousPhoto}>
                                <FontAwesome name='angle-left' size='2x' />
                            </Button>
                        </div>
                        <div className='nextNavButton'>
                            <Button className="fullHeight" onClick={nextPhoto}>
                                <FontAwesome name='angle-right' size='2x' />
                            </Button>
                        </div>
                        <div className='rotateNavButtons'>
                            <ButtonGroup>
                                <Button onClick={rotateLeft}><FontAwesome name='rotate-left' size='2x' /></Button>
                                <Button onClick={rotateRight}><FontAwesome name='rotate-right' size='2x' /></Button>
                            </ButtonGroup>
                        </div>
                        <div className='fullscreenButtons'>
                            <Button onClick={toggleFullScreen}><FontAwesome name='expand' size='2x' /></Button>
                        </div>
                        <div className='ratingButtons'>
                            <RatingStar photo={photo} rating={20} ratePhoto={ratePhoto} />
                            <RatingStar photo={photo} rating={40} ratePhoto={ratePhoto} />
                            <RatingStar photo={photo} rating={60} ratePhoto={ratePhoto} />
                            <RatingStar photo={photo} rating={80} ratePhoto={ratePhoto} />
                            <RatingStar photo={photo} rating={100} ratePhoto={ratePhoto} />
                        </div>
                    </div>
                ) : undefined
            }
        </Animation>
    );
};


PhotoNavigation.propTypes = {
    photo: PropTypes.object,
    visible: PropTypes.bool,
    nextPhoto: PropTypes.func,
    previousPhoto: PropTypes.func,
    rotatePhoto: PropTypes.func,
    ratePhoto: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        visible: state.visibility.navigation && !state.visibility.menu,
    };
};


const mapDispatchToProps = dispatchify({
    nextPhoto,
    previousPhoto,
    rotatePhoto,
    ratePhoto,
});


const PhotoNavigationContainer = connect(mapStateToProps, mapDispatchToProps)(PhotoNavigation);


export default PhotoNavigationContainer;
