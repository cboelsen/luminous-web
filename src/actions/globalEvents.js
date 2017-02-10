export function listenToWindowEvent(name, mapEventToAction, filter = (e) => true) {
    return function (dispatch) {
        function handleEvent(e) {
            if (filter(e)) {
                dispatch(mapEventToAction(e));
            }
        }

        window.addEventListener(name, handleEvent);

        return () => window.removeEventListener(name, handleEvent);
    };
}
