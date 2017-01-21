import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Alert} from 'reactstrap';

import 'velocity-animate'
import 'velocity-animate/velocity.ui'
import {VelocityTransitionGroup} from 'velocity-react'

import {removeAlert} from '../actions';

import {dispatchify} from '../utils';

import './AlertList.css';


export class AlertMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    removeAlert = () => {
        this.setState({visible: false});
        setTimeout(this.props.removeAlert, 350);
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


export const AlertList = ({alerts, removeAlert}) => {
    const alertTags = alerts.map((a) => (
        <AlertMessage key={a.id} alert={a} removeAlert={removeAlert.bind(this, a.id)} />
    ));

    return (
        <VelocityTransitionGroup runOnMount={true} enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
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


const mapDispatchToProps = dispatchify(
    removeAlert,
);


const AlertListContainer = connect(mapStateToProps, mapDispatchToProps)(AlertList);


export default AlertListContainer;
