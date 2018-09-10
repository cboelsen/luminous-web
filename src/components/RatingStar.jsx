import 'font-awesome/css/font-awesome.min.css';
import './RatingStar.css';

import React from 'react'
import PropTypes from 'prop-types';

import FontAwesome from 'react-fontawesome';


const RatingStar = ({photo, rating, ratePhoto, size}) => {
    if (size === undefined) {
        size = '2x';
    }
    const name = (photo.rating !== 50 && photo.rating >= rating) ? 'star' : 'star-o';
    return (
        <a className="blackLink" href='#' onClick={() => ratePhoto(photo, rating)}>
            <FontAwesome name={name} size={size} />
        </a>
    );
};


RatingStar.propTypes = {
    photo: PropTypes.object.isRequired,
    rating: PropTypes.number.isRequired,
    ratePhoto: PropTypes.func.isRequired,
    size: PropTypes.number,
};


export default RatingStar;
