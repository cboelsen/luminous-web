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
    const scale = Math.ceil(window.devicePixelRatio);
    const uriParams = {
        width: screen.width * scale,
        height: screen.height * scale,
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


export function dispatchify(functions) {
    return (dispatch) => {
        for (const fn_name in functions) {
            if (fn_name !== undefined) {
                const fn = functions[fn_name];
                functions[fn_name] = (...args) => dispatch(fn(...args))
            }
        }
        return functions;
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


export function formatDate(date) {
    return `${date.toDateString()}, ${date.toLocaleTimeString()}`;
}


export function debounce(fn, timeout) {
    let timer = null;
    let args = null;
    
    function handler() {
        if (args !== null && timer === null) {
            function timerCb() {
                timer = null;
                handler();
            }
            const result = fn(...args);
            args = null;
            timer = setTimeout(timerCb, timeout);
            return result;
        }
    }
    
    return function debounced(...givenArgs) {
        args = givenArgs;
        return handler();
    }
}


export function toggleFullScreen() {
    if (
            (document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
        if (document.documentElement.requestFullScreen) {  
            document.documentElement.requestFullScreen();  
        } else if (document.documentElement.mozRequestFullScreen) {  
            document.documentElement.mozRequestFullScreen();  
        } else if (document.documentElement.webkitRequestFullScreen) {  
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
    }
    else {  
        if (document.cancelFullScreen) {  
            document.cancelFullScreen();  
        } else if (document.mozCancelFullScreen) {  
            document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
            document.webkitCancelFullScreen();  
        }  
    }  
}
