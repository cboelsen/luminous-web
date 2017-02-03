import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'

import {RenameApp} from './RenameApp';


function setup() {
    const props = {
        addPhotosToQueue: jest.fn()
    };
  
    const enzymeWrapper = shallow(<RenameApp {...props} />);
  
    return {
        props,
        enzymeWrapper
    };
}


describe('apps.RenameApp:RenameApp', () => {
    it('should render self and subcomponents', () => {
        const {enzymeWrapper, props} = setup()
        expect(props.addPhotosToQueue).toHaveBeenCalledTimes(1);
    });
});
