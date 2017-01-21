import Immutable from 'seamless-immutable';

import actionTypes from '../constants/actions';

const moment = require('moment');


const initialState = Immutable.from({
    'next': [],
    'prev': [],
    'current': null,
    'slideshowRunning': false,
    'titles': [],
});


const addNewPhoto = (state, photo) => {
    state = state.updateIn(['titles'], list => list.concat(photo.title || ''));
    if (state.current === null) {
        return state.set('current', photo);
    }
    else {
        return state.updateIn(['next'], list => list.concat(photo));
    }
};


const nextPhoto = (state) => {
    let maxPrevQueueSize = 15;
    if (state.next.length === 0)
        return state;
    if (state.prev.length >= maxPrevQueueSize)
        state = state.updateIn(['prev'], list => list.slice(1));
    return state.updateIn(['prev'], list => list.concat(state.current))
        .set('current', state.next[0])
        .updateIn(['next'], list => list.slice(1));
};


const previousPhoto = (state) => {
    if (state.prev.length === 0)
        return state;
    return state.updateIn(['next'], list => [state.current].concat(list))
        .set('current', state.prev[state.prev.length - 1])
        .updateIn(['prev'], list => list.slice(0, -1));
};


// Only remove the photos from the upcoming queue.
const removePhoto = (state, photo) => {
    return state.updateIn(['next'], list => list.filter(p => {
        return (p.id !== photo.id);
    }));
};


const _updateMatchingPhotoDetails = (state, id, details) => {
    const updateDetails = (photo) => {
        if (photo.id === id)
            return photo.merge(details);
        return photo;
    };
    return state
        .updateIn(['next'], list => list.map(updateDetails))
        .updateIn(['prev'], list => list.map(updateDetails))
        .set('current', updateDetails(state.current));
};


const rotatePhoto = (state, photo) => {
    const details = {timeOfLastRotation: moment().format("x")};
    return _updateMatchingPhotoDetails(state, photo.id, details);
};


const updatePhoto = (state, photo, details) => {
    return _updateMatchingPhotoDetails(state, photo.id, details);
};


const photos = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NEW_PHOTO:
            return addNewPhoto(state, action.photo);
        case actionTypes.NEXT_PHOTO:
            return nextPhoto(state);
        case actionTypes.PREVIOUS_PHOTO:
            return previousPhoto(state);
        case actionTypes.REMOVE_PHOTO:
            return removePhoto(state, action.photo);
        case actionTypes.ROTATE_PHOTO:
            return rotatePhoto(state, action.photo);
        case actionTypes.UPDATE_PHOTO:
            return updatePhoto(state, action.photo, action.details);
        case actionTypes.START_SLIDESHOW:
            return state.set('slideshowRunning', true);
        case actionTypes.STOP_SLIDESHOW:
            return state.set('slideshowRunning', false);
        default:
            return state;
    }
};


export default photos;
