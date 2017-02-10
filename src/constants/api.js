import constants from './index';


const apiConstants = {
    SERVER_URL: constants.IS_DEV ? `http://sheeva.boelsen.net:4567` : `https://photos.boelsen.net/api`,
};


export default apiConstants;
