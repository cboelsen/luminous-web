import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'

import {App} from './App';


function setup() {
    const props = {
        loadSettings: jest.fn(),
        listenToWindowEvent: jest.fn(),
    };
  
    const enzymeWrapper = shallow(<App {...props} />);
  
    return {
        props,
        enzymeWrapper
    };
}


describe('apps.App:App', () => {
    it('should render self and subcomponents', () => {
        const {enzymeWrapper, props} = setup()
        expect(props.loadSettings).toHaveBeenCalledTimes(1);
        expect(props.listenToWindowEvent).toHaveBeenCalledTimes(3);
    });
});
