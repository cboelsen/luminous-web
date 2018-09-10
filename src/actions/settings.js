import createHistory from "history/createBrowserHistory"

import actionTypes from '../constants/actions';

import {getUrlSearchParams} from '../utils';


const history = createHistory()


function _createStoreFn() {
    return (k, v) => localStorage.setItem(k, JSON.stringify(v));
}


function _createRetrieveFn() {
    return (k) => JSON.parse(localStorage.getItem(k) || '{}');
}


function _createSetUrlParamsFn() {
    return (u) => history.push(u);
}


export function loadSettings() {
    return {
        type: actionTypes.LOAD_SETTINGS,
        retrieveFn: _createRetrieveFn(),
    };
};


export function saveSettings(newSettings) {
    return {
        type: actionTypes.SAVE_SETTINGS,
        settings: newSettings,
        storeFn: _createStoreFn(),
        setUrlParamsFn: _createSetUrlParamsFn(),
    };
};


export function updatePhotoFilters() {
    const params = getUrlSearchParams();
    const numParams = [...params].length;

    if (numParams === 0) {
        return {
            type: actionTypes.LOAD_PHOTO_FILTERS,
            setUrlParamsFn: _createSetUrlParamsFn(),
        };
    }
    else {
        let filters = {};
        for (const param of params) {
            filters[[param[0]]] = param[1];
        };

        return {
            type: actionTypes.SAVE_PHOTO_FILTERS,
            filters: filters,
            storeFn: _createStoreFn(),
        };
    }
};
