import Immutable from 'seamless-immutable';

import actionTypes from '../constants/actions';


const initialState = Immutable.from({
    'current': [],
});


const addAlert = (state, alert) => {
    return state.set('current', state.current.concat([alert]));
};


const removeAlert = (state, alert_id) => {
    return state.set('current', state.current.filter((a) => a.id !== alert_id));
};


const servers = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ALERT:
            return addAlert(state, action.alert);
        case actionTypes.REMOVE_ALERT:
            return removeAlert(state, action.id);
        default:
            return state;
    }
};


export default servers;
