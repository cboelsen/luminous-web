import { combineReducers } from 'redux';

import alerts from './alerts';
import photos from './photos';
import settings from './settings';
import visibility from './visibility';


const luminousReducers = combineReducers({
	alerts,
    photos,
    settings,
    visibility,
})


export default luminousReducers;
