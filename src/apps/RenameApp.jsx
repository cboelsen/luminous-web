import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addPhotosToQueue} from '../actions';

import {dispatchify} from '../utils';

import RenameForm from '../containers/RenameForm';


export class RenameApp extends React.Component {

    componentWillMount = () => {
        this.props.addPhotosToQueue();
    }

    shouldComponentUpdate = () => {
        return false;
    }

    render = () => {
        return (
            <div>
                <RenameForm />
                {this.props.children}
            </div>
        );
    }
}


RenameApp.propTypes = {
    addPhotosToQueue: PropTypes.func,
};


const mapDispatchToProps = dispatchify({
    addPhotosToQueue,
});


const RenameAppContainer = connect(() => {return {};}, mapDispatchToProps)(RenameApp);


export default RenameAppContainer;
