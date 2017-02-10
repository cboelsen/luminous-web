import actionTypes from '../constants/actions';

export * from './alerts';
export * from './globalEvents';
export * from './photos';
export * from './settings';


export const showMenus = () => {
    return {
        type: actionTypes.SHOW_MENU
    };
};


export const hideMenus = () => {
    return {
        type: actionTypes.HIDE_MENU
    };
};
