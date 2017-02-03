import { combineReducers } from 'redux';

import alerts from './alerts';
import photos from './photos';
import settings from './settings';
import timers from './timers';
import visibility from './visibility';


const luminousReducers = combineReducers({
	alerts,
    photos,
    settings,
    timers,
    visibility,
})


export default luminousReducers;
