const isDev = (process.env.NODE_ENV === 'development');


const constants = {
    IS_DEV: isDev,
    SERVER_URL: isDev ? `http://sheeva.boelsen.net:4567` : `/api`,
    MIN_PHOTO_QUEUE_SIZE: isDev ? 3 : 20,
    MIN_PHOTO_GET_SIZE: isDev ? 3 : 30,
};


export default constants;
