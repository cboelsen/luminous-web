import actionTypes from '../constants/actions';

import * as actions from './index';


describe('actions.index:showMenus', () => {
    it('should return an action to show menus', () => {
        const expectedAction = {
            type: actionTypes.SHOW_MENU,
        }
        expect(actions.showMenus()).toEqual(expectedAction)
    });
});

describe('actions.index:hideMenus', () => {
    it('should return an action to hide menus', () => {
        const expectedAction = {
            type: actionTypes.HIDE_MENU,
        }
        expect(actions.hideMenus()).toEqual(expectedAction)
    });
});
