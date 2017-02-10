import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {loadSettings} from '../actions';
import {dispatchify} from '../utils';

import AlertList from '../containers/AlertList';
import PhotoBackground from '../containers/PhotoBackground';


export class App extends React.Component {

    componentWillMount() {
        console.log(this.props);
        console.log(this.props.loadSettings);
        this.props.loadSettings();
    }

    render = () => {
        return (
            <div>
                <PhotoBackground />
                {this.props.children}
                <AlertList />
            </div>
        );
    }
}


App.propTypes = {
    loadSettings: PropTypes.func,
};


const mapDispatchToProps = dispatchify({
    loadSettings,
});


const AppContainer = connect(() => {return {};}, mapDispatchToProps)(App);


export default AppContainer;
