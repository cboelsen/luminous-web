import './PhotoInformation.css';

import React, {PropTypes} from 'react'

import {Table} from 'reactstrap';

import {formatDate} from '../utils';

import RatingStar from './RatingStar';


const PhotoInformation = ({photo, ratePhoto}) => {
    if (photo === null) {
        return <span />;
    }

    const date = new Date(Date.parse(photo.date));
    const dateString = formatDate(date);

    return (
        <Table>
            <thead>
                <tr>
                    <td className="rightAlign">Title: </td>
                    <td>{photo.title}</td>
                </tr>
                <tr>
                    <td className="rightAlign">Album: </td>
                    <td>{photo.album}</td>
                </tr>
                <tr>
                    <td className="rightAlign">Date: </td>
                    <td>{dateString}</td>
                </tr>
                <tr>
                    <td className="rightAlign">Rating: </td>
                    <td>
                        <RatingStar photo={photo} rating={20} ratePhoto={ratePhoto} />
                        <RatingStar photo={photo} rating={40} ratePhoto={ratePhoto} />
                        <RatingStar photo={photo} rating={60} ratePhoto={ratePhoto} />
                        <RatingStar photo={photo} rating={80} ratePhoto={ratePhoto} />
                        <RatingStar photo={photo} rating={100} ratePhoto={ratePhoto} />
                    </td>
                </tr>
            </thead>
        </Table>
    );
};


PhotoInformation.propTypes = {
    photo: PropTypes.object,
    ratePhoto: PropTypes.func,
};


export default PhotoInformation;
