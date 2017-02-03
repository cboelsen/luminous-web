import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';
import lolex from 'lolex';

import actionTypes from '../constants/actions';
import apiConstants from '../constants/api';

import * as actions from './index';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('actions.alerts:removeAlert', () => {
    it('should return an action to remove the given action ID', () => {
        const expectedAction = {
            type: actionTypes.REMOVE_ALERT,
            id: 1
        }
        expect(actions.removeAlert({id: 1})).toEqual(expectedAction)
    });
});


describe('actions.alerts:addAlert', () => {
    it('creates an action to add an Alert', () => {
        const alert = {id: 5}
        const expectedActions = [
            {type: actionTypes.ADD_ALERT, alert: alert},
        ];
        const store = mockStore({alerts: {current: []}});

        store.dispatch(actions.addAlert(alert));

        const actualActions = store.getActions();
        expect(actualActions).toEqual(expectedActions);
    })

    it('creates an action with a timeout to add an Alert, which is then removed', () => {
        var clock = lolex.install();

        const alert = {id: 5, duration: 1000}
        const expectedActions = [
            {type: actionTypes.ADD_ALERT, alert: alert},
            {type: actionTypes.REMOVE_ALERT, id: 5},
        ];
        const store = mockStore({alerts: {current: []}});

        store.dispatch(actions.addAlert(alert));
        store.subscribe(() => {
            const actualActions = store.getActions();
            expect(actualActions).toEqual(expectedActions);
        })

        clock.tick(1000);
        clock.uninstall();
    })

    it('creates an action to add an error as an Alert', () => {
        const msg = 'some message';
        const alert = {message: msg, duration: 10000, type: 'danger'};
        const expectedActions = [
            {type: actionTypes.ADD_ALERT, alert: alert},
        ];
        const store = mockStore({alerts: {current: []}});

        store.dispatch(actions.addError(msg));

        const actualActions = store.getActions();
        expect(actualActions.duration).toEqual(expectedActions.duration);
        expect(actualActions.message).toEqual(expectedActions.message);
        expect(actualActions.type).toEqual(expectedActions.type);
    })
})
