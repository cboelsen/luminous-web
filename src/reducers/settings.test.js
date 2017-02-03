import Immutable from 'seamless-immutable';
import settings from './settings';
import actionTypes from '../constants/actions';


describe('settings reducer', () => {
    it('should handle initial state', () => {
        expect(
            settings(undefined, {})
        ).toEqual(
            Immutable.from({
                slideshowInterval: 30,
                minimumRating: 50,
                photoFilterParams: {
                    rating__gte: 50,
                    ordering: '?',
                },
            })
        );
    });

    it('should handle ' + actionTypes.LOAD_PHOTO_FILTERS, () => {
        let filterParams = null;
        const setFilterParams = (p) => {filterParams = p;};
        const initState = Immutable.from({photoFilterParams: {blah: 1, clah: 'some'}});
        expect(
            settings(initState, {
                type: actionTypes.LOAD_PHOTO_FILTERS,
                setUrlParamsFn: setFilterParams,
            })
        ).toEqual(
            initState
        );
        expect(filterParams).toEqual('?blah=1&clah=some');
    });

    it('should handle ' + actionTypes.SAVE_PHOTO_FILTERS, () => {
        let storedSettings = null;
        const storeFn = (k, v) => {storedSettings = v;};
        const initState = Immutable.from({photoFilterParams: {}});
        const filters = {rating__gte: 80, path: '/something.jpg'};
        const expectedState1 = {minimumRating: 80, photoFilterParams: filters};
        expect(
            settings(initState, {
                type: actionTypes.SAVE_PHOTO_FILTERS,
                filters: filters,
                storeFn: storeFn,
            })
        ).toEqual(
            Immutable.from(expectedState1)
        );
        expect(
            storedSettings
        ).toEqual(expectedState1);
    });

    it('should handle ' + actionTypes.LOAD_SETTINGS, () => {
        const retrieveFn = () => {return {a: 3, c: 3};};
        const initState = Immutable.from({a: 1, b: 2});
        const expectedState = Immutable.from({a: 3, b: 2, c: 3});
        expect(
            settings(initState, {
                type: actionTypes.LOAD_SETTINGS,
                retrieveFn: retrieveFn,
            })
        ).toEqual(
            expectedState
        );
    });
});
