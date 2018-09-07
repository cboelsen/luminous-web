import actionTypes from '../constants/actions';


function uuid4() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
}


export function Alert(type, message, duration) {
    return {
        id: uuid4(),
        type: type,
        message: message,
        duration: duration,
    };
}


export const _addAlert = (alert) => {
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
