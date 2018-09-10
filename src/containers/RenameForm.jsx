import Immutable from 'seamless-immutable';

import React from 'react';
import {connect} from 'react-redux';
import {Typeahead} from 'react-typeahead';
import PropTypes from 'prop-types';

import {
    previousPhoto,
    nextPhoto,
    rotatePhoto,
    ratePhoto,
    renamePhoto,
} from '../actions';

import {stringContainsInvalidChars, dispatchify} from '../utils';


export class RenameForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {error: false};
    }

    static customClasses = {
        input: 'form-control',
        results: 'list-group',
        listItem: 'list-group-item',
        hover: 'active',
    };

    onKeyDown = (event) => {
        const value = (this._input !== undefined) ? this._input.refs.entry.value : '';
        const ctrlValue = 128;
        const ctrlDown = event.ctrlKey ? ctrlValue : 0;
        switch (event.keyCode | ctrlDown) {
            case 37 | ctrlValue:    // Ctrl right
                this.props.rotatePhoto(this.props.photo, 270);
                break;
            case 39 | ctrlValue:    // Ctrl left
                this.props.rotatePhoto(this.props.photo, 90);
                break;
            case 33:                // PageDn
            case 38 | ctrlValue:    // Ctrl up
                this.props.previousPhoto();
                break;
            case 34:                // PageUp
            case 40 | ctrlValue:    // Ctrl down
                this.props.nextPhoto();
                break;
            case 49 | ctrlValue:    // Ctrl 1
            case 50 | ctrlValue:    // Ctrl 2
            case 51 | ctrlValue:    // Ctrl 3
            case 52 | ctrlValue:    // Ctrl 4
            case 53 | ctrlValue:    // Ctrl 5
                const rating = (event.keyCode - 48) * 20;
                this.props.ratePhoto(this.props.photo, rating);
                break;
            case 13:                // Enter
            case 14:                // Return
                if (! this.state.error) {
                    this.props.renamePhoto(this.props.photo, value);
                    this.props.nextPhoto();
                }
                break;
            default:
                this.setState(() =>({error: stringContainsInvalidChars(value)}));
                return true;
        }
        event.preventDefault();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.photo !== null && this.props.photo.url !== prevProps.photo.url) {
            this._input.setEntryText(this.props.photo.title);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.props.photo !== nextProps.photo ||
            this.props.titles !== nextProps.titles ||
            this.state.error !== nextState.error
        );
    }

    render = () => {
        if (this.props.photo === null)
            return <span />;

        return (
            <div className={"form-group " + (this.state.error ? "has-error" : "")}>
                <Typeahead
                    ref={(ref) => this._input = ref}
                    options={this.props.titles}
                    value={this.props.photo.title}
                    maxVisible={8}
                    placeholder='Title'
                    onKeyDown={this.onKeyDown}
                    customClasses={RenameForm.customClasses}
                />
            </div>
        );
    }
};


RenameForm.propTypes = {
    photo: PropTypes.object,
    titles: PropTypes.array.isRequired,
    previousPhoto: PropTypes.func.isRequired,
    nextPhoto: PropTypes.func.isRequired,
    rotatePhoto: PropTypes.func.isRequired,
    ratePhoto: PropTypes.func.isRequired,
    renamePhoto: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
    return {
        photo: state.photos.current,
        titles: Immutable.asMutable(state.photos.titles),
    };
};


const mapDispatchToProps = dispatchify({
    previousPhoto,
    nextPhoto,
    rotatePhoto,
    ratePhoto,
    renamePhoto,
});


const RenameFormContainer = connect(mapStateToProps, mapDispatchToProps)(RenameForm);


export default RenameFormContainer;
