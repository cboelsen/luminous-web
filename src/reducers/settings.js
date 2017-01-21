import Immutable from 'seamless-immutable';

// import actionTypes from '../constants/actions';

// const moment = require('moment');


const initialState = Immutable.from({
    'slideshowInterval': 30,
    'minimumRating': 50,
});


const settings = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};


export default settings;
