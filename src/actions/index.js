import constants from '../constants';
import actionTypes from '../constants/actions';

import {stopSlideshow, startSlideshow} from './photos';

export * from './alerts';
export * from './globalEvents';
export * from './photos';
export * from './settings';


export function showMenus() {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.SHOW_MENU});
        if (getState().visibility.navigation === false) {
            dispatch(stopSlideshow());
        }
    };
};


export function hideMenus() {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.HIDE_MENU});
        if (getState().visibility.navigation === false) {
            dispatch(startSlideshow());
        }
    };
};


export function hideNavigation() {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.HIDE_NAV});
        if (getState().visibility.menu === false) {
            dispatch(startSlideshow());
        }
    };
}



export const showNavigation = (function createShowNavigation() {
    let timer = null;

    return function showNavigation() {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        return (dispatch, getState) => {
            if (getState().visibility.navigation === false) {
                dispatch({type: actionTypes.SHOW_NAV});
                if (getState().visibility.menu === false) {
                    dispatch(stopSlideshow());
                }
            }

            timer = setTimeout(() => {
                timer = null;
                dispatch(hideNavigation())
            }, constants.NAVIGATION_DISPLAY_TIME_MS);
        };
    }
})();
