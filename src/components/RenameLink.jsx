import React, {PropTypes} from 'react';
import {Link} from 'react-router'


const RenameLink = ({linkText, photoPath}) => {
    const query_params = {
        path__startswith: photoPath,
    };
    return (
        <Link to={{pathname: '/rename/', query: query_params}}>
            {linkText}
        </Link>
    );
}


RenameLink.propTypes = {
    linkText: PropTypes.string.isRequired,
    photoPath: PropTypes.string.isRequired,
};


export default RenameLink;
