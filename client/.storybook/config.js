import { configure } from '@storybook/react';

function loadStories() {
    const req = require.context('../app', true, /\.stories\.js$/);
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
