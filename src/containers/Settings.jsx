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

import {dispatchify} from '../utils';


function Option(display, value) {
    return {display, value};
}


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
                            value={settings.slideshowInterval}
                            saveSettings={saveSettings}
                            options={[
                                Option('10 seconds', 10), 
                                Option('30 seconds', 30), 
                                Option('1 minute', 60),
                                Option('2 minutes', 120),
                                Option('5 minutes', 300),
                                Option('10 minutes', 600),
                                Option('20 minutes', 1200),
                                Option('1 hour', 3600),
                                Option('2 hours', 7200),
                                Option('6 hours', 21600),
                                Option('1 day', 86400),
                            ]}
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
                            value={settings.minimumRating}
                            saveSettings={saveSettings}
                            options={[
                                Option('1 star',   20),
                                Option('2 stars',  40),
                                Option('3 stars',  60),
                                Option('4 stars',  80),
                                Option('5 stars', 100),
                                Option('unrated',  50),
                            ]}
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
