import constants from '../constants';
import actionTypes from '../constants/actions';

import Api from '../utils/api';

import * as alerts from './alerts';
import * as settings from './settings';


export const updatePhoto = (photo, details) => {
    return {
        type: actionTypes.UPDATE_PHOTO,
        photo: photo,
        details: details
    };
}


export const filterPhotosByScreenOrientation = () => {
    return (dispatch, getState) => {
        const currentOrientation = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
        if (currentOrientation !== undefined) {
            const wasLandscapeOriented = getState().settings.landscapeOrientation;
            const landscapeOrientation = currentOrientation.type.startsWith('landscape');
            if (landscapeOrientation !== wasLandscapeOriented) {
                dispatch(settings.saveSettings({landscapeOrientation}));
            }
        }
    };
};


export const ignoreScreenOrientation = () => {
    return (dispatch) => {
        dispatch(settings.saveSettings({landscapeOrientation: null}));
    }
};


export const updateScreenOrientation = () => {
    return (dispatch, getState) => {
        if (getState().settings.landscapeOrientation !== null) {
            dispatch(filterPhotosByScreenOrientation());
        }
    };
};


export const rotatePhoto = (photo, rotation) => {
    return async (dispatch) => {
        const alert = alerts.Alert('primary', 'Rotating photo...', 15000);
        dispatch(alerts._addAlert(alert));
        const data = {rotation: rotation};
        try {
            const updated_photo = await Api.patch(photo.url + 'rotate/', null, data);
            dispatch(updatePhoto(photo, updated_photo));
            dispatch({
                type: actionTypes.ROTATE_PHOTO,
                photo: photo,
            });
        } catch(error) {
            dispatch(alerts.addError('Problem occurred rotating photo on server: ' + error));
        }
        dispatch(alerts.removeAlert(alert));
    };
};


export const ratePhoto = (photo, rating) => {
    return async (dispatch) => {
        const details = {rating: rating};
        dispatch(updatePhoto(photo, details));
        try {
            const updated_photo = await Api.patch(photo.url, null, details);
            dispatch(updatePhoto(photo, updated_photo));
        }
        catch(error) {
            dispatch(alerts.addError('Problem occurred updating rating on server: ' + error));
            dispatch(updatePhoto(photo, {rating: photo.rating}));
        }
    };
};


export const renamePhoto = (photo, title) => {
    return async (dispatch) => {
        const details = {title: title};
        dispatch(updatePhoto(photo, details));
        try {
            const updated_photo = await Api.patch(photo.url, null, details);
            dispatch(updatePhoto(photo, updated_photo));
        }
        catch(error) {
            dispatch(alerts.addError('Problem occurred updating title on server: ' + error));
            dispatch(updatePhoto(photo, {title: photo.title}));
        }
    };
};


export const addNewPhoto = (photo) => {
    return {
        type: actionTypes.ADD_NEW_PHOTO,
        photo: photo
    }
};


export const removePhotoFromQueue = (photo) => {
    return {
        type: actionTypes.REMOVE_PHOTO,
        photo: photo
    };
};


export const addPhotosToQueue = () => {
    return async (dispatch, getState) => {
        const nextQueue = getState().photos.next;
        const minQueueSize = constants.MIN_PHOTO_QUEUE_SIZE;

        if ((minQueueSize - nextQueue.length) > 0) {
            const filters = new URL(window.location.href).searchParams;

            try {
                let json = await Api.get('/api/v1/photos/?' + filters.toString(), {});

                // TODO: Use these URLs to fetch the next photos.
                // TODO: Doing this would slow down getting random photos, eventually.
                const urls = {next: json.next, prev: json.prev};
                dispatch({
                    type: actionTypes.UPDATE_URLS,
                    urls: urls,
                });
                json.results.map((p) => dispatch(addNewPhoto(p)));
            } catch(error) {
                dispatch(alerts.addError('Problem occurred getting new photos to display: ' + error));
                throw error;
            }
        }
    }
};


export const reloadPhotoQueue = () => {
    return (dispatch) => {
        dispatch(updateScreenOrientation());
        dispatch({type: actionTypes.CLEAR_PHOTO_QUEUE});
        dispatch(addPhotosToQueue());
    };
};


export const _nextPhoto = () => {
    return (dispatch) => {
        dispatch(addPhotosToQueue());
        dispatch({type: actionTypes.NEXT_PHOTO});
    };
};


export const startSlideshow = () => {
    return (dispatch, getState) => {
        const slideshowInterval = getState().settings.slideshowInterval * 1000;
        let timer = setInterval(() => dispatch(_nextPhoto()), slideshowInterval);
        dispatch({
            type: actionTypes.START_SLIDESHOW,
            timer: timer
        });
    };
};


export const stopSlideshow = () => {
    return (dispatch, getState) => {
        let timer = getState().timers.slideshow;
        clearInterval(timer);
        dispatch({type: actionTypes.STOP_SLIDESHOW});
    };
};


export const restartSlideshow = () => {
    return (dispatch) => {
        dispatch(stopSlideshow());
        dispatch(startSlideshow());
    };
};


export const nextPhoto = () => {
    return (dispatch, getState) => {
        if (getState().timers.slideshow !== null) {
            dispatch(restartSlideshow());
        }
        dispatch(_nextPhoto());
    };
};


export const previousPhoto = () => {
    return (dispatch, getState) => {
        if (getState().timers.slideshow !== null) {
            dispatch(restartSlideshow());
        }
        dispatch({type: actionTypes.PREVIOUS_PHOTO});
    };
};
