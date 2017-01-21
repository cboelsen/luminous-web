import React from 'react';
import ReactDOM from 'react-dom';

import {AlertList} from './AlertList';


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <AlertList alerts={[]} removeAlert={() => {}}/>,
        div
    );
});
