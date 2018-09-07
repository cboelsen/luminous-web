const isDev = (process.env.NODE_ENV !== 'production');


const constants = {
    IS_DEV: isDev,
    SERVER_URL: isDev ? `http://sheeva.boelsen.net:4567` : `/api`,
    MIN_PHOTO_QUEUE_SIZE: isDev ? 3 : 20,
    MAX_PHOTO_HISTORY_SIZE: isDev ? 15 : 2000,
    NAVIGATION_DISPLAY_TIME_MS: 5000,
};


export default constants;
