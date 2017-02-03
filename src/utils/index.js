import apiConstants from '../constants/api';


export function getUrlSearchParams() {
    return new URL(window.location.href).searchParams;
}


export function invertObject(obj) {
    var new_obj = {};

    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }

    return new_obj;
}


export function urlConvertParams(params) {
    return Object.keys(params)
        .map((key) => [key, params[key]].map(encodeURIComponent).join('='))
        .join('&');
}


export function createUrl(urlString, params) {
    if (params === undefined) {
        params = {};
    }
    const paramString = urlConvertParams(params);
    if (urlString.indexOf('?') === -1 && paramString.length > 0) {
        urlString += '?';
    }
    return new URL(urlString + paramString);
}


export function photoImageUrl(photo) {
    const uriParams = {
        width: screen.width,
        height: screen.height,
        time_last_rotated: photo.timeOfLastRotation,
    };
    return createUrl(apiConstants.SERVER_URL + photo.url + 'image/', uriParams);
}


export function stringContainsInvalidChars(string) {
    if (string === undefined) {
        return false;
    }
    const invalidChars = new Set(['\\', '/', ':', '*', '?', '"', '<', '>', '|']);
    return (string.split('').filter((x) => invalidChars.has(x)).length > 0);
}


export function dispatchify(...functions) {
    return (dispatch) => {
        let fns = {}
        for (const fn of functions) {
            if (fn !== undefined) {
                fns[fn.name] = (...args) => dispatch(fn(...args))
            }
        }
        return fns;
    };
}


export function convertParamsForDjangoRestFramework(params) {
    let convertedParams = {}
    Object.entries(params).forEach(([key, val]) => {
        if (val === true || val === false) {
            val = val ? 'True' : 'False';
        }
        convertedParams[key] = val;
    });
    return convertedParams;
}
