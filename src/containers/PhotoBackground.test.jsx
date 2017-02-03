import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'
import lolex from 'lolex';

import * as utils from '../utils';

import {PhotoBackground} from './PhotoBackground.jsx';


describe('components.PhotoBackground:PhotoBackground', () => {
    function setupPhotoBackground(photo, visible=true) {
        const props = {
            photo: photo,
            visible: visible,
            showMenus: jest.fn(),
            hideMenus: jest.fn(),
        };
 
        const enzymeWrapper = shallow(<PhotoBackground {...props} />);
 
        return {
            props,
            enzymeWrapper
        };
    }

    it('should render a plain span when no photo is given', () => {
        utils.photoImageUrl = jest.fn();

        const {enzymeWrapper, props} = setupPhotoBackground(null);
        expect(enzymeWrapper.find('div')).toHaveLength(0);
        expect(enzymeWrapper.find('span')).toHaveLength(1);
        expect(utils.photoImageUrl).toHaveBeenCalledTimes(0);
    });

    it('should render two divs when a photo is given', () => {
        utils.photoImageUrl = jest.fn();

        const {enzymeWrapper, props} = setupPhotoBackground({});
        expect(enzymeWrapper.find('div')).toHaveLength(2);
        expect(enzymeWrapper.find('span')).toHaveLength(0);
        expect(utils.photoImageUrl).toHaveBeenCalledTimes(1);
    });

    it('should render children\'s styles based on visibility (true)', () => {
        const photoUrl = 'http://photo-url/photo.jpg';
        utils.photoImageUrl = jest.fn();
        utils.photoImageUrl.mockReturnValueOnce(photoUrl);

        const {enzymeWrapper, props} = setupPhotoBackground({});
        expect(enzymeWrapper.find('div').first().html()).toContain(`background-image:url(${photoUrl});`);
        expect(enzymeWrapper.find('div').last().html()).toContain(`opacity:0;`);
    });

    it('should render children\'s styles based on visibility (false)', () => {
        const photoUrl = 'http://photo-url/photo.jpg';
        utils.photoImageUrl = jest.fn();
        utils.photoImageUrl.mockReturnValueOnce(photoUrl);

        const {enzymeWrapper, props} = setupPhotoBackground({}, false);
        expect(enzymeWrapper.find('div').first().html()).toContain(`background-image:url(${photoUrl});`);
        expect(enzymeWrapper.find('div').last().html()).toContain(`opacity:0.5;`);
    });

    it('should change method called based on visibility (true)', () => {
        utils.photoImageUrl = jest.fn();

        const {enzymeWrapper, props} = setupPhotoBackground({});
        enzymeWrapper.find('div').first().props().onClick();
        expect(props.showMenus).toHaveBeenCalledTimes(1);
        expect(props.hideMenus).toHaveBeenCalledTimes(0);
    });

    it('should change method called based on visibility (false)', () => {
        utils.photoImageUrl = jest.fn();

        const {enzymeWrapper, props} = setupPhotoBackground({}, false);
        enzymeWrapper.find('div').first().props().onClick();
        expect(props.showMenus).toHaveBeenCalledTimes(0);
        expect(props.hideMenus).toHaveBeenCalledTimes(1);
    });
});
