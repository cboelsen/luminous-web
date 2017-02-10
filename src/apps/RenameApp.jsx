import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {addPhotosToQueue} from '../actions';

import {dispatchify} from '../utils';

import RenameForm from '../containers/RenameForm';


export class RenameApp extends React.Component {

    componentWillMount() {
        this.props.addPhotosToQueue();
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
