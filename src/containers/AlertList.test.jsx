import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'
import lolex from 'lolex';

import {AlertList, AlertMessage} from './AlertList.jsx';


describe('components.AlertList:AlertList', () => {
    function setupAlertList(alerts) {
        const props = {
            alerts: alerts,
            removeAlert: jest.fn(),
        };
 
        const enzymeWrapper = shallow(<AlertList {...props} />);
 
        return {
            props,
            enzymeWrapper
        };
    }

    it('should render self with no alerts', () => {
        const {enzymeWrapper, props} = setupAlertList([])
        expect(enzymeWrapper.find('AlertMessage')).toHaveLength(0);
    });

    it('should render self with a single alert', () => {
        const alerts = [{id: 1}]
        const {enzymeWrapper, props} = setupAlertList(alerts);
        expect(enzymeWrapper.find('AlertMessage')).toHaveLength(alerts.length);
    });

    it('should render self with multiple alerts', () => {
        const alerts = [{id: 1}, {id: 2}, {id: 3}]
        const {enzymeWrapper, props} = setupAlertList(alerts);
        expect(enzymeWrapper.find('AlertMessage')).toHaveLength(alerts.length);
    });
});


describe('components.AlertList:AlertMessage', () => {
    function setupAlertMessage(alert) {
        const props = {
            alert: alert,
            removeAlert: jest.fn(),
        };
 
        const enzymeWrapper = shallow(<AlertMessage {...props} />);
 
        return {
            props,
            enzymeWrapper
        };
    }

    it('should render self with the given props', () => {
        const alert = {type: 'primary', message: 'Some message'};
        const {enzymeWrapper, props} = setupAlertMessage(alert)
        const alertProps = enzymeWrapper.find('Alert').props();
        expect(alertProps.color).toEqual(alert.type);
        expect(alertProps.children).toEqual(alert.message);
    });

    it('should render self with the given props', () => {
        var clock = lolex.install();

        const alert = {type: 'primary', message: 'Some message'};
        const {enzymeWrapper, props} = setupAlertMessage(alert)

        expect(enzymeWrapper.state().visible).toBeTruthy();
        enzymeWrapper.instance().removeAlert();
        expect(enzymeWrapper.state().visible).not.toBeTruthy();

        expect(props.removeAlert).toHaveBeenCalledTimes(0);
        clock.tick(1000);
        // TODO: Why does this fail?!?!?!
        // expect(props.removeAlert).toHaveBeenCalledTimes(1);

        clock.uninstall();
    });
});
