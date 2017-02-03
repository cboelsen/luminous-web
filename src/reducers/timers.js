import Immutable from 'seamless-immutable';

import actionTypes from '../constants/actions'


const initialState = Immutable.from({
    'slideshow': null,
});


const timers = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_SLIDESHOW:
            return state.set('slideshow', action.timer);
        case actionTypes.STOP_SLIDESHOW:
            return state.set('slideshow', null);
        default:
            return state
    }
};


export default timers;
