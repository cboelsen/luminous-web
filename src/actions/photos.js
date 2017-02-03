import Raven from 'raven-js';

import constants from '../constants';
import actionTypes from '../constants/actions';
import {photoImageUrl} from '../utils';

import Api from '../utils/api';

import * as alerts from './alerts';


export const updatePhoto = (photo, details) => {
    return {
        type: actionTypes.UPDATE_PHOTO,
        photo: photo,
        details: details
    };
}


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


export const cachePhoto = (photo) => {
    return (dispatch) => {
        let img = new Image();
        img.onerror = (e) => {
            dispatch(alerts.addError('Could not cache photo: ' + photo.path));
            Raven.captureMessage(
                'Error caching photo "' + photo.path + '"',
                {extra: {photo: photo, event: e}}
            );
            dispatch(removePhotoFromQueue(photo));
        };
        img.src = photoImageUrl(photo);
        return img;
    }
};


export const addPhotosToQueue = () => {
    return async (dispatch, getState) => {
        const nextQueue = getState().photos.next;
        const minQueueSize = constants.MIN_PHOTO_QUEUE_SIZE;
        // TODO: Idea: Check if the orientation has changed, and reload if it
        // has. Then this can just another 'filters'.
        //const isScreenLandscape = (screen.width > screen.height);

        if ((minQueueSize - nextQueue.length) > 0) {
            const filters = new URL(window.location.href).searchParams;

            try {
                let json = await Api.get('/v1/photos/?' + filters.toString(), {});

                const urls = {next: json.next, prev: json.prev};
                dispatch({
                    type: actionTypes.UPDATE_URLS,
                    urls: urls,
                });

                for (const p of json.results) {
                    dispatch(addNewPhoto(p));
                    dispatch(cachePhoto(p));
                }
            } catch(error) {
                dispatch(alerts.addError('Problem occurred getting new photos to display: ' + error));
            }
        }
    }
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