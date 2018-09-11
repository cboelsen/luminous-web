import './Settings.css';

import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';

import {Table} from 'reactstrap';
import {Button} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import {
    saveSettings,
    ignoreScreenOrientation,
    filterPhotosByScreenOrientation,
} from '../actions';

import {dispatchify, invertObject} from '../utils';


function Option(display, value) {
    return {display, value};
}


class MappedOptions {
    constructor(options) {
        this.options = options;
        this.invertedOptions = invertObject(options);
    }

    valueToKey = (value) => {
        return this.invertedOptions[value];
    }

    toArray = () => {
        return Object.keys(this.options).map((k) => Option(k, this.options[k]));
    }
};


class DropDownSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    toggle = () => {
        this.setState((state) => ({dropdownOpen: !state.dropdownOpen}));
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.value !== nextProps.value ||
            this.state.dropdownOpen !== nextState.dropdownOpen
        );
    }

    render = () => {
        const {name, value, options, saveSettings} = this.props;
        const itemTags = options.map((o) =>
            <DropdownItem key={o.value} onClick={() => saveSettings({[name]: o.value})}>{o.display}</DropdownItem>
        );

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {value}
                </DropdownToggle>
                <DropdownMenu>
                    {itemTags}
                </DropdownMenu>
            </Dropdown>
        );
    }
};


const intervalOptions = new MappedOptions({
    '10 seconds': 10,
    '30 seconds': 30,
    '1 minute': 60,
    '2 minutes': 120,
    '5 minutes': 300,
    '10 minutes': 600,
    '20 minutes': 1200,
    '1 hour': 3600,
    '2 hours': 7200,
    '6 hours': 21600,
    '1 day': 86400,
});


const ratingOptions = new MappedOptions({
    '1 star':   20,
    '2 stars':  40,
    '3 stars':  60,
    '4 stars':  80,
    '5 stars': 100,
    'unrated':  50,
});


export const Settings = ({settings, saveSettings, filterPhotosByScreenOrientation, ignoreScreenOrientation}) => {
    const usingOrientation = (settings.landscapeOrientation !== null);
    const changeUsingOrientation = (usingOrientation) ? ignoreScreenOrientation : filterPhotosByScreenOrientation;

    return (
        <Table>
            <thead>
                <tr>
                    <td className="rightAlign">Slideshow interval: </td>
                    <td>
                        <DropDownSetting
                            name='slideshowInterval'
                            value={intervalOptions.valueToKey(settings.slideshowInterval)}
                            saveSettings={saveSettings}
                            options={intervalOptions.toArray()}
                        />
                    </td>
                </tr>
                <tr>
                    <td className="rightAlign">Use screen orientation: </td>
                    <td>
                        <Button color="primary" active={usingOrientation} onClick={changeUsingOrientation}>
                            {usingOrientation ? 'Yes' : 'No'}
                        </Button>
                    </td>
                </tr>
                <tr>
                    <td className="rightAlign">Minimum rating: </td>
                    <td>
                        <DropDownSetting
                            name='minimumRating'
                            value={ratingOptions.valueToKey(settings.minimumRating)}
                            saveSettings={saveSettings}
                            options={ratingOptions.toArray()}
                        />
                    </td>
                </tr>
            </thead>
        </Table>
    );
};


Settings.propTypes = {
    saveSettings: PropTypes.func,
    ignoreScreenOrientation: PropTypes.func,
    filterPhotosByScreenOrientation: PropTypes.func,
};


const mapStateToProps = (state) => {
    return {
        settings: state.settings,
    }
};


const mapDispatchToProps = dispatchify({
    saveSettings,
    ignoreScreenOrientation,
    filterPhotosByScreenOrientation,
});


const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(Settings);


export default SettingsContainer;
