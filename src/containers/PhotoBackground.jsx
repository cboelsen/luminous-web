import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {VelocityComponent} from 'velocity-react'

import {photoImageUrl, dispatchify} from '../utils'

import {showMenus, hideMenus} from '../actions'

import './PhotoBackground.css';


const PhotoDiv = ({photo, zIndex}) => {
    if (photo === null) {
        return <span />
    }
    const backgroundImage = `url(${photoImageUrl(photo)})`;
    return (
        <div className="photobg" style={{backgroundImage, zIndex}} />
    );
};


export class PhotoBackground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstVisible: false,
            firstPhoto: null,
            secondPhoto: null,
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.photo !== nextProps.photo) {
            const nextDivToShow = (this.state.firstVisible) ? 'secondPhoto' : 'firstPhoto';
            let newState = {
                firstVisible: !this.state.firstVisible,
                [nextDivToShow] : nextProps.photo,
            };
            this.setState(newState);
        }
    }

    render = () => {
        const {photo, showOverlay, showMenus, hideMenus} = this.props;
        const onClickFn = showOverlay ? hideMenus : showMenus;
        const spinner = (photo === null)
            ? <img className="centered" role="presentation" src='/images/spinner.gif' /> 
            : <span />;

        return (
            <div style={{width: '100vw', height: '100vh', position: 'fixed'}}>
                {spinner}
                <VelocityComponent animation={{opacity: this.state.firstVisible ? 1 : 0}} duration={700} delay={500}>
                    <PhotoDiv photo={this.state.firstPhoto} zIndex={-3} />
                </VelocityComponent>
                <VelocityComponent animation={{opacity: this.state.firstVisible ? 0 : 1}} duration={700} delay={500}>
                    <PhotoDiv photo={this.state.secondPhoto} zIndex={-2} />
                </VelocityComponent>
                <VelocityComponent animation={{opacity: showOverlay ? 0.5 : 0}} duration={100}>
                    <div className="overlay" onClick={onClickFn} />
                </VelocityComponent>
            </div>
        );
    }
};


PhotoBackground.propTypes = {
    photo: PropTypes.object,
    showOverlay: PropTypes.bool,
    showMenus: PropTypes.func,
    hideMenus: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        showOverlay: !state.visibility.photoBackground
    }
};


const mapDispatchToProps = dispatchify({
    showMenus,
    hideMenus,
});


const PhotoBackgroundContainer = connect(mapStateToProps, mapDispatchToProps)(PhotoBackground);


export default PhotoBackgroundContainer;
