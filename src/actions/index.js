import constants from '../constants';
import actionTypes from '../constants/actions';

export * from './alerts';
export * from './globalEvents';
export * from './photos';
export * from './settings';


export function showMenus() {
    return {
        type: actionTypes.SHOW_MENU
    };
};


export function hideMenus() {
    return {
        type: actionTypes.HIDE_MENU
    };
};


export function hideNavigation() {
    return {
        type: actionTypes.HIDE_NAV
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
            }

            timer = setTimeout(() => {
                timer = null;
                dispatch(hideNavigation())
            }, constants.NAVIGATION_DISPLAY_TIME_MS);
        };
    }
})();
