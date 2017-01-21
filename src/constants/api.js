const isDev = (process.env.NODE_ENV === 'development');


const apiConstants = {
    SERVER_URL: isDev ? `http://sheeva.boelsen.net:4567` : `/api`,
};


export default apiConstants;
