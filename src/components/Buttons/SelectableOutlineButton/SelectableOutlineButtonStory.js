import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SelectableOutlineButton from './SelectableOutlineButton';

storiesOf('FormBuilderElements', module)
  .add('SelectableOutlineButton', () => {
    return (
      <div style={{'background': 'darkgrey'}}>
        <h3>Default</h3>
        <SelectableOutlineButton>Phone</SelectableOutlineButton>
        <h3>Active</h3>
        <SelectableOutlineButton isInitiallySelected>Phone</SelectableOutlineButton>
        <h3>Finalised</h3>
      </div>
    );
  });
