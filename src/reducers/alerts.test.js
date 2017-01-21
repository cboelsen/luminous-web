import Immutable from 'seamless-immutable';
import alerts from './alerts';
import actionTypes from '../constants/actions';


describe('photos reducer', () => {
    it('should handle initial state', () => {
        expect(
            alerts(undefined, {})
        ).toEqual(
            Immutable.from({
                'current': [],
            })
        );
    });

    it('should handle ' + actionTypes.ADD_ALERT, () => {
        const initState = Immutable.from({current: [1]});
        const nextState1 = Immutable.from({current: [1, 2]});
        expect(
            alerts(initState, {
                type: actionTypes.ADD_ALERT,
                alert: 2,
            })
        ).toEqual(
            nextState1
        )

        const nextState2 = Immutable.from({current: [1, 2, 3]});
        expect(
            alerts(nextState1, {
                type: actionTypes.ADD_ALERT,
                alert: 3
            })
        ).toEqual(
            nextState2
        )
    });

    it('should handle ' + actionTypes.REMOVE_ALERT, () => {
        const initState = Immutable.from({current: [{id: 1}, {id: 3}, {id: 6}]});
        const nextState1 = Immutable.from({current: [{id: 1}, {id: 6}]});
        expect(
            alerts(initState, {
                type: actionTypes.REMOVE_ALERT,
                id: 3,
            })
        ).toEqual(
            nextState1
        )

        const nextState2 = Immutable.from({current: [{id: 1}, {id: 3}]});
        expect(
            alerts(initState, {
                type: actionTypes.REMOVE_ALERT,
                id: 6,
            })
        ).toEqual(
            nextState2
        )

        const nextState3 = Immutable.from({current: [{id: 3}, {id: 6}]});
        expect(
            alerts(initState, {
                type: actionTypes.REMOVE_ALERT,
                id: 1,
            })
        ).toEqual(
            nextState3
        )
    });
});
