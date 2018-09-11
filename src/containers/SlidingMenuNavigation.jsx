import 'font-awesome/css/font-awesome.min.css';
import './SlidingMenuNavigation.css';

import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import 'velocity-animate'
import 'velocity-animate/velocity.ui'

import {Button, ButtonGroup, Col, Container, Row} from 'reactstrap';

import FontAwesome from 'react-fontawesome';

import {nextPhoto, previousPhoto, rotatePhoto, stopSlideshow, startSlideshow} from '../actions';

import {dispatchify, toggleFullScreen} from '../utils';


export const SlidingMenuNavigation = ({
    photo, visible, slideshowRunning,
    nextPhoto, previousPhoto, rotatePhoto, stopSlideshow, startSlideshow
}) => {
    if (photo === null) {
        return <span />;
    }

    const rotateLeft = () => rotatePhoto(photo, 270);
    const rotateRight = () => rotatePhoto(photo, 90);

    const pauseToggleFn = slideshowRunning ? stopSlideshow : startSlideshow;
    const pauseToggleIcon = slideshowRunning ? 'pause' : 'play';

    return (
        <Container>
            <Row>
            </Row>
            <Row>
                <Col xs="auto">
                    <ButtonGroup>
                        <Button onClick={previousPhoto}>
                            <FontAwesome name='step-backward' size='2x' />
                        </Button>
                        <Button onClick={pauseToggleFn}>
                            <FontAwesome name={pauseToggleIcon} size='2x' />
                        </Button>
                        <Button onClick={nextPhoto}>
                            <FontAwesome name='step-forward' size='2x' />
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col xs="2">
                    <ButtonGroup>
                        <Button onClick={rotateLeft}><FontAwesome name='rotate-left' size='2x' /></Button>
                        <Button onClick={rotateRight}><FontAwesome name='rotate-right' size='2x' /></Button>
                    </ButtonGroup>
                </Col>
                <Col xs="2">
                    <Button onClick={toggleFullScreen}><FontAwesome name='expand' size='2x' /></Button>
                </Col>
            </Row>
        </Container>
    );
};


SlidingMenuNavigation.propTypes = {
    photo: PropTypes.object,
    visible: PropTypes.bool,
    slideshowRunning: PropTypes.bool,
    nextPhoto: PropTypes.func,
    previousPhoto: PropTypes.func,
    rotatePhoto: PropTypes.func,
    stopSlideshow: PropTypes.func,
    startSlideshow: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        visible: state.visibility.navigation && !state.visibility.menu,
        slideshowRunning: state.photos.slideshowRunning,
    };
};


const mapDispatchToProps = dispatchify({
    nextPhoto,
    previousPhoto,
    rotatePhoto,
    stopSlideshow,
    startSlideshow,
});


const SlidingMenuNavigationContainer = connect(mapStateToProps, mapDispatchToProps)(SlidingMenuNavigation);


export default SlidingMenuNavigationContainer;
