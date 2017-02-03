import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'
import lolex from 'lolex';

import * as utils from '../utils';

import {RenameForm} from './RenameForm.jsx';


describe('components.RenameForm:RenameForm', () => {
    function setupRenameForm(photo, titles) {
        const props = {
            photo: photo,
            titles: titles,
            previousPhoto: jest.fn(),
            nextPhoto: jest.fn(),
            rotatePhoto: jest.fn(),
            ratePhoto: jest.fn(),
            renamePhoto: jest.fn(),
        };
 
        const enzymeWrapper = shallow(<RenameForm {...props} />);
 
        return {
            props,
            enzymeWrapper
        };
    }

    function createFakeEvent(keyCode, ctrlPressed) {
        let event = {
            preventDefault: jest.fn(),
            ctrlKey: ctrlPressed,
            keyCode: keyCode,
        };
        return event;
    }

    it('should render a plain span when no photo is given', () => {
        // utils.stringContainsInvalidChars = jest.fn();

        const {enzymeWrapper, props} = setupRenameForm(null, []);
        expect(enzymeWrapper.find('span')).toHaveLength(1);
        expect(props.previousPhoto).toHaveBeenCalledTimes(0);
        expect(props.nextPhoto).toHaveBeenCalledTimes(0);
        expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
        expect(props.ratePhoto).toHaveBeenCalledTimes(0);
        expect(props.renamePhoto).toHaveBeenCalledTimes(0);
    });

    const photo_rating_test_data = [
        {keyCode: 49, rating: 20},
        {keyCode: 50, rating: 40},
        {keyCode: 51, rating: 60},
        {keyCode: 52, rating: 80},
        {keyCode: 53, rating: 100},
    ];

    for (const test_data of photo_rating_test_data) {
        const {keyCode, rating} = test_data;
        it(`should rate photo ${rating} when ctrl-${keyCode-48} is pressed`, () => {
            const photo = {photo: 'yes'};
            const {enzymeWrapper, props} = setupRenameForm(photo, []);
            const event = createFakeEvent(keyCode, true);
            enzymeWrapper.instance().onKeyDown(event);

            expect(props.previousPhoto).toHaveBeenCalledTimes(0);
            expect(props.nextPhoto).toHaveBeenCalledTimes(0);
            expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
            expect(props.ratePhoto).toHaveBeenCalledTimes(1);
            expect(props.renamePhoto).toHaveBeenCalledTimes(0);

            expect(props.ratePhoto).toHaveBeenCalledWith(photo, rating);
        });
    }

    it('should rate not rate photo when ctrl not pressed', () => {
        const photo = {photo: 'yes'};
        const {enzymeWrapper, props} = setupRenameForm(photo, []);
        for (const keyCode of [49, 50, 51, 52, 53]) {
            const event = createFakeEvent(keyCode, false);
            enzymeWrapper.instance().onKeyDown(event);
        }

        expect(props.previousPhoto).toHaveBeenCalledTimes(0);
        expect(props.nextPhoto).toHaveBeenCalledTimes(0);
        expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
        expect(props.ratePhoto).toHaveBeenCalledTimes(0);
        expect(props.renamePhoto).toHaveBeenCalledTimes(0);
    });

    for (const keyCode of [13, 14]) {
        it('should rename photo when enter/return pressed', () => {
            const photo = {photo: 'yes'};
            const title = 'Blah'
            const {enzymeWrapper, props} = setupRenameForm(photo, []);
            const event = createFakeEvent(keyCode, false);
            enzymeWrapper.instance()._input = {refs: {entry: {value: title}}};
            enzymeWrapper.instance().onKeyDown(event);

            expect(props.previousPhoto).toHaveBeenCalledTimes(0);
            expect(props.nextPhoto).toHaveBeenCalledTimes(1);
            expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
            expect(props.ratePhoto).toHaveBeenCalledTimes(0);
            expect(props.renamePhoto).toHaveBeenCalledTimes(1);

            expect(props.renamePhoto).toHaveBeenCalledWith(photo, title);
        });
    }

    const photo_rotation_test_data = [
        {keyCode: 37, rotation: 270, key: 'right'},
        {keyCode: 39, rotation: 90, key: 'left'},
    ];

    for (const test_data of photo_rotation_test_data) {
        const {keyCode, rotation, key} = test_data;
        it(`should rotate photo ${rotation}° when ctrl-${key} is pressed`, () => {
            const photo = {photo: 'yes'};
            const {enzymeWrapper, props} = setupRenameForm(photo, []);
            const event = createFakeEvent(keyCode, true);
            enzymeWrapper.instance().onKeyDown(event);

            expect(props.previousPhoto).toHaveBeenCalledTimes(0);
            expect(props.nextPhoto).toHaveBeenCalledTimes(0);
            expect(props.rotatePhoto).toHaveBeenCalledTimes(1);
            expect(props.ratePhoto).toHaveBeenCalledTimes(0);
            expect(props.renamePhoto).toHaveBeenCalledTimes(0);

            expect(props.rotatePhoto).toHaveBeenCalledWith(photo, rotation);
        });
    }

    const photo_previous_test_data = [
        {keyCode: 33, ctrl: false, key: 'page up'},
        {keyCode: 38, ctrl: true, key: 'ctrl-up'},
    ];

    for (const test_data of photo_previous_test_data) {
        const {keyCode, ctrl, key} = test_data;
        it(`should select previous photo when ${key} is pressed`, () => {
            const {enzymeWrapper, props} = setupRenameForm(null, []);
            const event = createFakeEvent(keyCode, ctrl);
            enzymeWrapper.instance().onKeyDown(event);

            expect(props.previousPhoto).toHaveBeenCalledTimes(1);
            expect(props.nextPhoto).toHaveBeenCalledTimes(0);
            expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
            expect(props.ratePhoto).toHaveBeenCalledTimes(0);
            expect(props.renamePhoto).toHaveBeenCalledTimes(0);
        });
    }

    const photo_next_test_data = [
        {keyCode: 34, ctrl: false, key: 'page down'},
        {keyCode: 40, ctrl: true, key: 'ctrl-down'},
    ];

    for (const test_data of photo_next_test_data) {
        const {keyCode, ctrl, key} = test_data;
        it(`should select next photo when ${key} is pressed`, () => {
            const {enzymeWrapper, props} = setupRenameForm(null, []);
            const event = createFakeEvent(keyCode, ctrl);
            enzymeWrapper.instance().onKeyDown(event);

            expect(props.previousPhoto).toHaveBeenCalledTimes(0);
            expect(props.nextPhoto).toHaveBeenCalledTimes(1);
            expect(props.rotatePhoto).toHaveBeenCalledTimes(0);
            expect(props.ratePhoto).toHaveBeenCalledTimes(0);
            expect(props.renamePhoto).toHaveBeenCalledTimes(0);
        });
    }
});
