import Immutable from 'seamless-immutable';

import constants from '../constants';
import actionTypes from '../constants/actions';


const initialState = Immutable.from({
    next: [],
    prev: [],
    current: null,
    slideshowRunning: false,
    titles: [],
    urls: {
        next: null,
        prev: null,
    },
});


const addNewPhoto = (state, photo) => {
    let titles_set = new Set([...state.titles]);
    titles_set.add(photo.title || '');
    state = state.set('titles', [...titles_set]);

    if (state.current === null) {
        return state.set('current', photo);
    }
    else {
        return state.updateIn(['next'], list => list.concat(photo));
    }
};


const nextPhoto = (state) => {
    const maxPrevQueueSize = constants.MAX_PHOTO_HISTORY_SIZE;
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
    // TODO: Remove from the titles as well!!
    return state.updateIn(['next'], list => list.filter(p => {
        return (p.url !== photo.url);
    }));
};


const _updateMatchingPhotoDetails = (state, url, details) => {
    const updateDetails = (photo) => {
        if (photo.url === url)
            return photo.merge(details);
        return photo;
    };
    state = state
        .updateIn(['next'], list => list.map(updateDetails))
        .updateIn(['prev'], list => list.map(updateDetails))
        .set('current', updateDetails(state.current));

    const all_titles = state.prev.map((p) => p.title || '').concat(
                       state.next.map((p) => p.title || '').concat(
                       [state.current.title || '']));
    const titles_set = new Set(all_titles);
    state = state.set('titles', [...titles_set]);

    return state;
};


const rotatePhoto = (state, photo) => {
    const details = {timeOfLastRotation: Date.now()};
    return _updateMatchingPhotoDetails(state, photo.url, details);
};


const updatePhoto = (state, photo, details) => {
    return _updateMatchingPhotoDetails(state, photo.url, details);
};


function clearPhotoQueue(state) {
    return state.set('next', []);
}


function updateUrls(state, urls) {
    return state
        .setIn(['urls', 'prev'], urls.prev)
        .setIn(['urls', 'next'], urls.next);
}


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
        case actionTypes.CLEAR_PHOTO_QUEUE:
            return clearPhotoQueue(state);
        case actionTypes.START_SLIDESHOW:
            return state.set('slideshowRunning', true);
        case actionTypes.STOP_SLIDESHOW:
            return state.set('slideshowRunning', false);
        case actionTypes.UPDATE_URLS:
            return updateUrls(state, action.urls);
        default:
            return state;
    }
};


export default photos;
