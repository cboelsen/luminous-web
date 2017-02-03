import React from 'react';
import ReactDOM from 'react-dom';

import {shallow} from 'enzyme'

import RenameLink from './RenameLink.jsx';


const photoPath = '/media/photos/something/here'


function setup() {
    const props = {
        linkText: 'Rename',
        photoPath: photoPath,
    };
  
    const enzymeWrapper = shallow(<RenameLink {...props} />);
  
    return {
        props,
        enzymeWrapper
    };
}


describe('components.RenameLink:RenameLink', () => {
    it('should render self and subcomponents', () => {
        const {enzymeWrapper, props} = setup()
        const linkProps = enzymeWrapper.find('Link').props();
        expect(linkProps.children).toBe('Rename');
        expect(linkProps.to.pathname).toBe('/rename/');
        expect(linkProps.to.query.path__startswith).toBe(photoPath);
    });
});
