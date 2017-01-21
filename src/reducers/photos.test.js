import Immutable from 'seamless-immutable';
import photos from './photos';
import actionTypes from '../constants/actions';

var lolex = require("lolex");


describe('photos reducer', () => {
    it('should handle initial state', () => {
        expect(
            photos(undefined, {})
        ).toEqual(
            Immutable.from({
                'next': [],
                'prev': [],
                'current': null,
                'slideshowRunning': false,
                'titles': [],
            })
        );
    });

    it('should handle ' + actionTypes.ADD_NEW_PHOTO, () => {
        const initState = Immutable.from({next: [], prev: [], current: null, titles: []});
        const photo1 = {title: '1'};
        const nextState1 = Immutable.from({next: [], prev: [], current: photo1, titles: ['1']});
        expect(
            photos(initState, {
                type: actionTypes.ADD_NEW_PHOTO,
                photo: photo1
            })
        ).toEqual(
            nextState1
        )

        const photo2 = {title: null};
        const nextState2 = Immutable.from({'next': [photo2], 'prev': [], 'current': photo1, titles: ['1', '']});
        expect(
            photos(nextState1, {
                type: actionTypes.ADD_NEW_PHOTO,
                photo: photo2
            })
        ).toEqual(
            nextState2
        )

        const photo3 = {title: '3'};
        const nextState3 = Immutable.from({'next': [photo2, photo3], 'prev': [], current: photo1, titles: ['1', '', '3']});
        expect(
            photos(nextState2, {
                type: actionTypes.ADD_NEW_PHOTO,
                photo: photo3
            })
        ).toEqual(
            nextState3
        );
    });

    it('should handle ' + actionTypes.NEXT_PHOTO, () => {
        const initState = Immutable.from({'next': ['photo2', 'photo3'], 'prev': [], 'current': 'photo'});
        const nextState1 = Immutable.from({'next': ['photo3'], 'prev': ['photo'], 'current': 'photo2'});
        expect(
            photos(initState, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            nextState1
        );

        const nextState2 = Immutable.from({'next': [], 'prev': ['photo', 'photo2'], 'current': 'photo3'});
        expect(
            photos(nextState1, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            nextState2
        );

        expect(
            photos(nextState2, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            nextState2
        );

        let prev_photos = Array.apply(null, Array(14)).map((x, i) => 'photo' + (i + 4).toString())
        const initState2 = Immutable.from({'next': ['photo1', 'photo2'], 'prev': prev_photos, 'current': 'photo'});

        prev_photos.push('photo');
        const overflowState1 = Immutable.from({'next': ['photo2'], 'prev': prev_photos, 'current': 'photo1'});

        expect(
            photos(initState2, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            overflowState1
        );

        prev_photos.push('photo1');
        prev_photos.shift();
        const overflowState2 = Immutable.from({'next': [], 'prev': prev_photos, 'current': 'photo2'});

        expect(
            photos(overflowState1, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            overflowState2
        );

        expect(
            photos(overflowState2, {type: actionTypes.NEXT_PHOTO})
        ).toEqual(
            overflowState2
        );
    });

    it('should handle ' + actionTypes.PREVIOUS_PHOTO, () => {
        const initState = Immutable.from({'prev': ['photo2', 'photo3'], 'next': [], 'current': 'photo'});
        const nextState1 = Immutable.from({'prev': ['photo2'], 'next': ['photo'], 'current': 'photo3'});
        expect(
            photos(initState, {
                type: actionTypes.PREVIOUS_PHOTO
            })
        ).toEqual(
            nextState1
        );

        const nextState2 = Immutable.from({'prev': [], 'next': ['photo3', 'photo'], 'current': 'photo2'});
        expect(
            photos(nextState1, {
                type: actionTypes.PREVIOUS_PHOTO
            })
        ).toEqual(
            nextState2
        );

        expect(
            photos(nextState2, {
                type: actionTypes.PREVIOUS_PHOTO
            })
        ).toEqual(
            nextState2
        );
    });

    it('should see the same state after the same number of ' + actionTypes.NEXT_PHOTO + ' and ' +
                actionTypes.PREVIOUS_PHOTO + ' actions', () => {
        const initState = Immutable.from({'prev': [1, 2, 3, 4], 'next': [6, 7, 8, 9], 'current': 5});
        const p = actionTypes.PREVIOUS_PHOTO;
        const n = actionTypes.NEXT_PHOTO;
        expect(
            photos(photos(photos(photos(photos(photos(initState, p), p), p), n), n), n)
        ).toEqual(
            initState
        );
        expect(
            photos(photos(photos(photos(photos(photos(initState, n), n), n), p), p), p)
        ).toEqual(
            initState
        );
    });

    it('should handle ' + actionTypes.REMOVE_PHOTO, () => {
        const initState = Immutable.from({'prev': [{id: 'photo1'}, {id: 'photo2'}], 'next': [{id: 'photo3'}, {id: 'photo4'}, {id: 'photo5'}], 'current': {id: 'photo'}});

        expect(
            photos(initState, {
                type: actionTypes.REMOVE_PHOTO,
                photo: {id: 'photo3'}
            })
        ).toEqual(
            Immutable.from({'prev': [{id: 'photo1'}, {id: 'photo2'}], 'next': [{id: 'photo4'}, {id: 'photo5'}], 'current': {id: 'photo'}})
        );

        expect(
            photos(initState, {
                type: actionTypes.REMOVE_PHOTO,
                photo: {id: 'photo4'}
            })
        ).toEqual(
            Immutable.from({'prev': [{id: 'photo1'}, {id: 'photo2'}], 'next': [{id: 'photo3'}, {id: 'photo5'}], 'current': {id: 'photo'}})
        );

        expect(
            photos(initState, {
                type: actionTypes.REMOVE_PHOTO,
                photo: {id: 'photo5'}
            })
        ).toEqual(
            Immutable.from({'prev': [{id: 'photo1'}, {id: 'photo2'}], 'next': [{id: 'photo3'}, {id: 'photo4'}], 'current': {id: 'photo'}})
        );

        expect(
            photos(initState, {
                type: actionTypes.REMOVE_PHOTO,
                photo: {id: 'photo2'}
            })
        ).toEqual(
            initState 
        );

        expect(
            photos(initState, {
                type: actionTypes.REMOVE_PHOTO,
                photo: {id: 'photo'}
            })
        ).toEqual(
            initState
        );
    });

    it('should handle ' + actionTypes.ROTATE_PHOTO, () => {
        var clock = lolex.install(100, ['Date']);

        const initState = Immutable.from({'next': [], 'prev': [], 'current': {'id': 1}});
        expect(
           photos(initState, {
               type: actionTypes.ROTATE_PHOTO,
               photo: {'id': 1},
           })
        ).toEqual(
            initState.setIn(['current'], Immutable.from({'id': 1, 'timeOfLastRotation': '100'}))
        );

        const initState2 = Immutable.from({'next': [{'id': 3}, {'id': 1}, {'id': 2}], 'prev': [{'id': 4}, {'id': 2}], 'current': {'id': 1}});
        expect(
           photos(initState2, {
               type: actionTypes.ROTATE_PHOTO,
               photo: {'id': 1},
           })
        ).toEqual(
            initState2
                .setIn(['current'], Immutable.from({'id': 1, 'timeOfLastRotation': '100'}))
                .setIn(['next'], Immutable.from([{'id': 3}, {'id': 1, 'timeOfLastRotation': '100'}, {'id': 2}]))
        );

        const initState3 = Immutable.from({'next': [{'id': 3}, {'id': 1}, {'id': 2}], 'prev': [{'id': 1}, {'id': 1}], 'current': {'id': 2}});
        expect(
           photos(initState3, {
               type: actionTypes.ROTATE_PHOTO,
               photo: {'id': 1},
           })
        ).toEqual(
            initState3
                .setIn(['next'], Immutable.from([{'id': 3}, {'id': 1, 'timeOfLastRotation': '100'}, {'id': 2}]))
                .setIn(['prev'], Immutable.from([{'id': 1, 'timeOfLastRotation': '100'}, {'id': 1, 'timeOfLastRotation': '100'}]))
        );

        clock.uninstall();
    });

    it('should handle ' + actionTypes.UPDATE_PHOTO, () => {
        const initState = Immutable.from({'next': [], 'prev': [], 'current': {'id': 1}});
        expect(
           photos(initState, {
               type: actionTypes.UPDATE_PHOTO,
               photo: {'id': 1},
               details: {'det': 2},
           })
        ).toEqual(
            initState.setIn(['current'], Immutable.from({'id': 1, 'det': 2}))
        );

        const initState2 = Immutable.from({'next': [{'id': 3}, {'id': 1}, {'id': 2}], 'prev': [{'id': 4}, {'id': 2}], 'current': {'id': 1}});
        expect(
           photos(initState2, {
               type: actionTypes.UPDATE_PHOTO,
               photo: {'id': 1},
               details: {'det': 2},
           })
        ).toEqual(
            initState2
                .setIn(['current'], Immutable.from({'id': 1, 'det': 2}))
                .setIn(['next'], Immutable.from([{'id': 3}, {'id': 1, 'det': 2}, {'id': 2}]))
        );

        const initState3 = Immutable.from({'next': [{'id': 3}, {'id': 1, 'det': 3}, {'id': 2}], 'prev': [{'id': 1}, {'id': 1}], 'current': {'id': 2}});
        expect(
           photos(initState3, {
               type: actionTypes.UPDATE_PHOTO,
               photo: {'id': 1},
               details: {'det': 2},
           })
        ).toEqual(
            initState3
                .setIn(['next'], Immutable.from([{'id': 3}, {'id': 1, 'det': 2}, {'id': 2}]))
                .setIn(['prev'], Immutable.from([{'id': 1, 'det': 2}, {'id': 1, 'det': 2}]))
        );
    });

    it('should handle ' + actionTypes.START_SLIDESHOW, () => {
        const mkstate = (running) => {
            return Immutable.from({'slideshowRunning': running});
        };

        expect(
            photos(mkstate(false), {type: actionTypes.START_SLIDESHOW})
        ).toEqual(
            mkstate(true)
        );

        expect(
            photos(mkstate(true), {type: actionTypes.START_SLIDESHOW})
        ).toEqual(
            mkstate(true)
        );
    });

    it('should handle ' + actionTypes.STOP_SLIDESHOW, () => {
        const mkstate = (running) => {
            return Immutable.from({'slideshowRunning': running});
        };

        expect(
            photos(mkstate(false), {type: actionTypes.STOP_SLIDESHOW})
        ).toEqual(
            mkstate(false)
        );

        expect(
            photos(mkstate(true), {type: actionTypes.STOP_SLIDESHOW})
        ).toEqual(
            mkstate(false)
        );
    });
});
