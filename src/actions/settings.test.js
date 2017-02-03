import actionTypes from '../constants/actions';

import * as actions from './index';
import * as utils from '../utils';


describe('actions.settings:loadSettings', () => {
    it('should return an action to load the settings from the given function', () => {
        const action = actions.loadSettings();
        expect(action.type).toEqual(actionTypes.LOAD_SETTINGS);
        const fn = action.retrieveFn;
        expect(fn && fn.constructor && fn.call && fn.apply).toBeTruthy();
    });
});

describe('actions.settings:saveSettings', () => {
    it('should return an action to save the given settings to the given functions', () => {
        const settings = {a: 1, b: 'b'};
        const action = actions.saveSettings(settings);
        expect(action.type).toEqual(actionTypes.SAVE_SETTINGS);
        expect(action.settings).toEqual(settings);
        let fn = action.storeFn;
        expect(fn && fn.constructor && fn.call && fn.apply).toBeTruthy();
        fn = action.setUrlParamsFn;
        expect(fn && fn.constructor && fn.call && fn.apply).toBeTruthy();
    });
});

describe('actions.settings:updatePhotoFilters', () => {
    it('should return an action to load the filters into the given function', () => {
        utils.getUrlSearchParams = jest.fn();
        utils.getUrlSearchParams.mockReturnValueOnce([]);

        const action = actions.updatePhotoFilters();
        expect(action.type).toEqual(actionTypes.LOAD_PHOTO_FILTERS);
        let fn = action.setUrlParamsFn;
        expect(fn && fn.constructor && fn.call && fn.apply).toBeTruthy();

        expect(utils.getUrlSearchParams).toHaveBeenCalledTimes(1);
    });
});

describe('actions.settings:updatePhotoFilters', () => {
    it('should return an action to save the filters into the given function', () => {
        utils.getUrlSearchParams = jest.fn();
        utils.getUrlSearchParams.mockReturnValueOnce([
            ['param1', 'value1'],
            ['param2', 1234]
        ]);

        const action = actions.updatePhotoFilters();
        expect(action.type).toEqual(actionTypes.SAVE_PHOTO_FILTERS);
        expect(action.filters).toEqual({param1: 'value1', param2: 1234});
        let fn = action.storeFn;
        expect(fn && fn.constructor && fn.call && fn.apply).toBeTruthy();

        expect(utils.getUrlSearchParams).toHaveBeenCalledTimes(1);
    });
});
