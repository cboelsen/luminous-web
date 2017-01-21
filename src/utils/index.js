import apiConstants from '../constants/api';


export function createUrl(urlstring, params) {
    let url = new URL(urlstring);
    if (params !== undefined) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    return url;
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
