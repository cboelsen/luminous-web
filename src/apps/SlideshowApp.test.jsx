import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'

import {SlideshowApp} from './SlideshowApp';


function setup() {
    const props = {
        addPhotosToQueue: jest.fn(),
        startSlideshow: jest.fn(),
        updatePhotoFilters: jest.fn(),
        listenToWindowEvent: jest.fn(),
    };
  
    const enzymeWrapper = shallow(<SlideshowApp {...props} />);
  
    return {
        props,
        enzymeWrapper
    };
}


describe('apps.SlideshowApp:SlideshowApp', () => {
    it('should render self and subcomponents', () => {
        const {enzymeWrapper, props} = setup()
        expect(props.addPhotosToQueue).toHaveBeenCalledTimes(1);
        expect(props.startSlideshow).toHaveBeenCalledTimes(1);
        expect(props.updatePhotoFilters).toHaveBeenCalledTimes(1);
        expect(props.listenToWindowEvent).toHaveBeenCalledTimes(1);
    });
});
