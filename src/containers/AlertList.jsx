import './AlertList.css';

import React from 'react';
import {connect} from 'react-redux';
import {Alert} from 'reactstrap';
import PropTypes from 'prop-types';

import 'velocity-animate'
import 'velocity-animate/velocity.ui'
import {VelocityTransitionGroup} from 'velocity-react'

import {removeAlert} from '../actions';

import {dispatchify} from '../utils';


export class AlertMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    removeAlert = () => {
        this.setState(() => ({visible: false}));
        setTimeout(this.props.removeAlert, 350);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.alert !== nextProps.alert ||
            this.state.visible !== nextState.visible
        );
    }

    render = () => {
        const alert = this.props.alert;
        return (
            <Alert color={alert.type} isOpen={this.state.visible} toggle={this.removeAlert}>
                {alert.message}
            </Alert>
        );
    }
};


AlertMessage.propTypes = {
    alert: PropTypes.object,
    removeAlert: PropTypes.func,
};


const enterAnimation = {animation: "slideDown"};
const leaveAnimation = {animation: "slideUp"};


export const AlertList = ({alerts, removeAlert}) => {
    const alertTags = alerts.map((a) => (
        <AlertMessage key={a.id} alert={a} removeAlert={removeAlert.bind(this, a.id)} />
    ));

    return (
        <VelocityTransitionGroup runOnMount={true} enter={enterAnimation} leave={leaveAnimation}>
            <div className="alertList">
                {alertTags}
            </div>
        </VelocityTransitionGroup>
    );
};


AlertList.propTypes = {
    alerts: PropTypes.array,
    removeAlert: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        alerts: state.alerts.current,
    };
};


const mapDispatchToProps = dispatchify({
    removeAlert,
});


const AlertListContainer = connect(mapStateToProps, mapDispatchToProps)(AlertList);


export default AlertListContainer;
