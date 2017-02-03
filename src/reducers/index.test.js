import Immutable from 'seamless-immutable';
import reducers from './index';


describe('combined reducer', () => {
    it('should handle initial state', () => {
        const state = reducers(undefined, {});
        expect(state.alerts).not.toBeUndefined();
        expect(state.photos).not.toBeUndefined();
        expect(state.settings).not.toBeUndefined();
        expect(state.timers).not.toBeUndefined();
        expect(state.visibility).not.toBeUndefined();
    });
});
