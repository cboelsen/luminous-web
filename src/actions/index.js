import Raven from 'raven-js';

import constants from '../constants';
import actionTypes from '../constants/actions';
import { photoImageUrl } from '../utils';
import Api from '../utils/api';


function uuid4() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}


function Alert(type, message, duration) {
    return {
        id: uuid4(),
        type: type,
        message: message,
        duration: duration,
    };
}


const _addAlert = (alert) => {
    return {
        type: actionTypes.ADD_ALERT,
        alert: alert,
    };
};


export const removeAlert = (alert) => {
    return {
        type: actionTypes.REMOVE_ALERT,
        id: alert.id,
    };
};


export const addAlert = (alert) => {
    return (dispatch) => {
        if (alert.duration !== undefined) {
            setTimeout(() => dispatch(removeAlert(alert)), alert.duration);
        }
        dispatch(_addAlert(alert));
    }
};


export const addError = (error) => {
    return (dispatch) => {
        dispatch(addAlert(Alert('danger', error, 10000)))
    };
};


export const showMenus = () => {
    return {
        type: actionTypes.SHOW_MENU
    };
};


export const hideMenus = () => {
    return {
        type: actionTypes.HIDE_MENU
    };
};


export const rotatePhoto = (photo, rotation) => {
    return async (dispatch) => {
        const alert = Alert('primary', 'Rotating photo...', 15000);
        dispatch(_addAlert(alert));
        const data = {rotation: rotation};
        try {
            await Api.patch(photo.url + 'rotate/', null, data)
            dispatch({
                type: actionTypes.ROTATE_PHOTO,
                photo: photo,
            });
        } catch(error) {
            dispatch(addError('Problem occurred rotating photo on server: ' + error));
        }
        dispatch(removeAlert(alert));
    };
};


export const updatePhoto = (photo, details) => {
    return {
        type: actionTypes.UPDATE_PHOTO,
        photo: photo,
        details: details
    };
}


export const ratePhoto = (photo, rating) => {
    return async (dispatch) => {
        dispatch(updatePhoto(photo, {rating: rating}));
        try {
            await Api.patch(photo, null, {rating: rating})
        }
        catch(error) {
            dispatch(addError('Problem occurred updating rating on server: ' + error));
            dispatch(updatePhoto(photo, {rating: photo.rating}));
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
            dispatch(addError('Could not cache photo: ' + photo.path));
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


export const addRandomPhoto = () => {
    return async (dispatch, getState) => {
        const nextQueue = getState().photos.next;
        const minQueueSize = constants.MIN_PHOTO_QUEUE_SIZE;
        const minGetSize = constants.MIN_PHOTO_GET_SIZE;
        const isScreenLandscape = (screen.width > screen.height);

        if ((minQueueSize - nextQueue.length) > 0) {
            const numberToGet = Math.max(minGetSize, minQueueSize - nextQueue.length).toString();
            let params = {
                limit: numberToGet,
                rating__gte: getState().settings.minimumRating,
                landscape_orientation: isScreenLandscape,
            };

            try {
                const json = await Api.get('/v1/photos/random/', params);
                for (const p of json) {
                    dispatch(addNewPhoto(p));
                    dispatch(cachePhoto(p));
                }
            } catch(error) {
                dispatch(addError('Problem occurred getting new photos to display: ' + error));
            }
        }
    }
};


export const _nextPhoto = () => {
    return (dispatch) => {
        dispatch(addRandomPhoto());
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
    return (dispatch) => {
        dispatch(restartSlideshow());
        dispatch(_nextPhoto());
    };
};


export const previousPhoto = () => {
    return (dispatch) => {
        dispatch(restartSlideshow());
        dispatch({type: actionTypes.PREVIOUS_PHOTO});
    };
};
