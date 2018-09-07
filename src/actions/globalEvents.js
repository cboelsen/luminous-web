export function listenToWindowEvent(name, action, filter = (e) => true) {
    return function (dispatch) {
        function handleEvent(e) {
            if (filter(e)) {
                dispatch(action(e));
            }
        }

        window.addEventListener(name, handleEvent);

        return () => window.removeEventListener(name, handleEvent);
    };
}
