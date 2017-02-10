import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';
import lolex from 'lolex';

import actionTypes from '../constants/actions';
import * as api from '../utils/api';
import * as alerts from './alerts';

import * as actions from './photos';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('actions.photos:updatePhoto', () => {
    it('should return an action to update the given photo with the given details', () => {
        const action = actions.updatePhoto('photo', 'details');
        expect(action.type).toEqual(actionTypes.UPDATE_PHOTO);
        expect(action.photo).toEqual('photo');
        expect(action.details).toEqual('details');
    });
});

// return async (dispatch) => {
//     const alert = alerts.Alert('primary', 'Rotating photo...', 15000);
//     dispatch(alerts._addAlert(alert));
//     const data = {rotation: rotation};
//     try {
//         const updated_photo = await Api.patch(photo.url + 'rotate/', null, data);
//         dispatch(updatePhoto(photo, updated_photo));
//         dispatch({
//             type: actionTypes.ROTATE_PHOTO,
//             photo: photo,
//         });
//     } catch(error) {
//         dispatch(alerts.addError('Problem occurred rotating photo on server: ' + error));
//     }
//     dispatch(alerts.removeAlert(alert));
// };
describe('actions.photos:rotatePhoto', () => {
    it('should handle successfully rotating a photo', () => {
        var clock = lolex.install();

        const photo = 'photo';
        const rotation = 90;
        const updatedPhoto = 'updated';

        const addAlertAction = {type: 'addAlert'};
        const removeAlertAction = {type: 'removeAlert'};
        const expectedActions = [
            // {type: actionTypes.ADD_ALERT, alert: alert},
            // {type: actionTypes.REMOVE_ALERT, id: 5},
        ];

        api.default.patch = jest.fn(() => updatedPhoto);
        alerts.Alert = jest.fn(() => {return {};});
        alerts._addAlert = jest.fn(() => addAlertAction);
        alerts.removeAlert = jest.fn(() => removeAlertAction);
        alerts.addError = jest.fn((err) => {return {type: 'addError', error: err};});

        const store = mockStore({});

        store.dispatch(actions.rotatePhoto(photo, rotation));
        const actualActions = store.getActions();
        expect(actualActions).toEqual([addAlertAction]);

        // TODO: There has to be a better way!!
        // store.subscribe(() => {
        //     const actualActions = store.getActions();
        //     if (
        //     expect(actualActions).toEqual([
        //         addAlertAction,
        //         {type: actionTypes.UPDATE_PHOTO, photo, details: updatedPhoto},
        //         {type: actionTypes.ROTATE_PHOTO, photo},
        //     ]);
        // })

        clock.tick(15000);
        clock.uninstall();
    });
});
