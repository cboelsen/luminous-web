import nock from 'nock';
import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';

import actionTypes from '../constants/actions';
import apiConstants from '../constants/api';

import * as actions from './index';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('actions.index:removeAlert', () => {
    it('should return an action to remove the given action ID', () => {
        const expectedAction = {
            type: actionTypes.REMOVE_ALERT,
            id: 1
        }
        expect(actions.removeAlert({id: 1})).toEqual(expectedAction)
    });
});


describe('actions.index:addAlert', () => {
    it('creates an action to add an Alert', () => {
        const alert = {id: 5}
        const expectedActions = [
            { type: actionTypes.ADD_ALERT, alert: alert },
        ];
        const store = mockStore({alerts: {current: []}});

        return store.dispatch(actions.addAlert(alert))
        .then(() => { // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})


describe('actions.index:ratePhoto', () => {
    afterEach(() => {
        nock.cleanAll()
    })
  
    it('creates an action to add an Alert', () => {
        nock(apiConstants.SERVER_URL)
        .get('/todos')
        .reply(200, { body: { todos: ['do something'] }})
    
        const expectedActions = [
            { type: types.FETCH_TODOS_REQUEST },
            { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something']  } }
        ]
        const store = mockStore({ todos: [] })
    
        return store.dispatch(actions.fetchTodos())
        .then(() => { // return of async actions
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
