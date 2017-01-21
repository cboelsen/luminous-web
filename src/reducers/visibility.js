import Immutable from 'seamless-immutable';

import actionTypes from '../constants/actions'


const initialState = Immutable.from({
    'menu': false,
    'photoBackground': true,
});


const visibility = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_MENU:
            return state.set('menu', true).set('photoBackground', false);
        case actionTypes.HIDE_MENU:
            return state.set('menu', false).set('photoBackground', true);
        default:
            return state
    }
};


export default visibility;
