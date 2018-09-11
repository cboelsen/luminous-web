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
    if (response.status !== 204) {
        return response.json();
    }
}


const Api = {
    token: null,

    _request: (method, endpoint, data, params) => {
        if (params === null) {
            params = {};
        }
        let headers = {
            'Accept': 'application/json',
        }
        if (Api.token !== null) {
            headers['Authorization'] = "Token " + Api.token;
        }
        if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
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

    request: (method, endpoint, data, params) => {
        if (Api.token === null) {
            return Api.logIn("test", "test")
                .then(() => Api._request(method, endpoint, data, params));
        }
        return Api._request(method, endpoint, data, params);
    },

    get: (endpoint, params=null) => {
        return Api.request('GET', endpoint, null, params);
    },

    post: (endpoint, token, data=null, params=null) => {
        return Api.request('POST', endpoint, data, params);
    },

    patch: (endpoint, token, data=null, params=null) => {
        return Api.request('PATCH', endpoint, data, params);
    },

    put: (endpoint, token, data=null, params=null) => {
        return Api.request('PUT', endpoint, data, params);
    },

    delete: (endpoint, token) => {
        return Api.request('DELETE', endpoint, null, null);
    },

    logIn: (username, password) => {
        const authData = {username: username, password: password}
        return Api._request("POST", "/api/token-auth/", authData, {})
            .then(json => json.token)
            .then(t => {Api.token = t});
    },
};


export default Api;
