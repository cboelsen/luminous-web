import Raven from 'raven-js';

import apiConstants from '../constants/api';
import {createUrl, convertParamsForDjangoRestFramework} from './index';


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        Raven.captureMessage(
            'Error when checking response from "' + response.url + '" - [' + response.status + ']: ' + response.statusText,
            {extra: {error: error, response: response}}
        );
        throw error;
    }
}


function parseResponse(response) {
    checkStatus(response);
    return response.json();
}


const Api = {
    request: (method, endpoint, token, data, params) => {
        if (params === null) {
            params = {};
        }
        let headers = {
            'Accept': 'application/json',
        }
        if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
        }
        // TODO: Do this properly!!!
        if (token === null) {
            token = 'af9a83ee04af88bf76a75f5b8d38d256742890f6';
        }
        if (token !== null) {
            headers['Authorization'] = "Token " + token;
        }
        let details = {
            method: method,
            headers: headers,
            mode: 'cors',
            cache: 'default',
        }
        if (data !== null) {
            details['body'] = JSON.stringify(data);
        }
        const convertedParams = convertParamsForDjangoRestFramework(params);
        return fetch(
            createUrl(apiConstants.SERVER_URL + endpoint, convertedParams),
            details,
        )
        .then(parseResponse);
    },

    get: (endpoint, params=null) => {
        return Api.request('GET', endpoint, null, null, params);
    },

    post: (endpoint, token, data=null, params=null) => {
        return Api.request('POST', endpoint, token, data, params);
    },

    patch: (endpoint, token, data=null, params=null) => {
        return Api.request('PATCH', endpoint, token, data, params);
    },

    put: (endpoint, token, data=null, params=null) => {
        return Api.request('PUT', endpoint, token, data, params);
    },

    delete: (endpoint, token) => {
        return Api.request('DELETE', endpoint, token, null, null);
    },
};


export default Api;
