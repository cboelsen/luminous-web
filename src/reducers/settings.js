import Immutable from 'seamless-immutable';

import actionTypes from '../constants/actions';

import {urlConvertParams, invertObject} from '../utils';


const defaultMinimumRating = 50;
const defaultFilterParams = {
    rating__gte: defaultMinimumRating,
    ordering: '?',
};

const settingToFilterMap = {
    minimumRating: 'rating__gte',
};
const filterToSettingMap = invertObject(settingToFilterMap);

const initialState = Immutable.from({
    'slideshowInterval': 30,
    'minimumRating': defaultMinimumRating,
    'photoFilterParams': defaultFilterParams,
});


function savePhotoFilters(state, filters, storeFn) {
    for (const filter in filters) {
        if (filterToSettingMap.hasOwnProperty(filter)) {
            state = state.set(filterToSettingMap[filter], filters[filter]);
        }
    }
    state = state.set('photoFilterParams', filters);
    storeFn('settings', state);
    return state;
}


function loadPhotoFilters(state, setUrlParamsFn) {
    const filterParams = urlConvertParams(state.photoFilterParams);
    setUrlParamsFn(`?${filterParams}`);
    return state;
}


function saveSettings(state, newSettings, storeFn, setUrlParamsFn) {
    const oldSettings = state;
    const settings = Object.assign(oldSettings, newSettings);

    let updatedPhotoFilterParams = Immutable.asMutable(settings.photoFilterParams);
    for (const setting in newSettings) {
        if (settingToFilterMap.hasOwnProperty(setting)) {
            updatedPhotoFilterParams[setting] = newSettings[setting];
        }
    }

    storeFn('settings', settings);
    setUrlParamsFn(settings.photoFilterParams);

    const filterParams = urlConvertParams(updatedPhotoFilterParams);
    setUrlParamsFn(`?${filterParams}`);

    return Immutable.from(settings).set('photoFilterParams', updatedPhotoFilterParams);
}


function loadSettings(state, retrieveFn) {
    const oldSettings = state;
    const storedSettings = retrieveFn('settings');
    const settings = Immutable.merge(oldSettings, storedSettings);
    return settings;
}


const settings = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_PHOTO_FILTERS:
            return savePhotoFilters(state, action.filters, action.storeFn);
        case actionTypes.LOAD_PHOTO_FILTERS:
            return loadPhotoFilters(state, action.setUrlParamsFn);
        case actionTypes.SAVE_SETTINGS:
            return saveSettings(state, action.newSettings, action.storeFn, action.setUrlParamsFn);
        case actionTypes.LOAD_SETTINGS:
            return loadSettings(state, action.retrieveFn);
        default:
            return state;
    }
};


export default settings;
