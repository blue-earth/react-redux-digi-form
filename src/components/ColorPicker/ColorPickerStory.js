import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ColorPicker from './ColorPicker';


storiesOf('Color Picker', module)
  .add('default', () => (
    <ColorPicker value="#000000" />
  ))
  .add('override colour swatches', () => (
    <ColorPicker value="#000000" customSwatches={['#3993d1', '#2c3744', '#ffffff', '#000000']} />
  ));
