import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Dropdown from './Dropdown';

storiesOf('Dropdown', module)
  .add('Select dropdown', () => {
    const choices = [
      '',
      'sdkfls dflksdjfvln vslkakldjsf lsnvlksjdlkfjsdlf',
      'sdfsdfsdf sdfsdf sdfsdfsdff',
      '3', '4', '5', '6', '7', '8'];
    const defaultOption = choices[0];
    return (
      <div style={{width: '500px'}}>
        <Dropdown className="dropdown" choices={choices} placeholder="Select option" onChange={action('onChange')} />
        <Dropdown className="dropdown" value={''} choices={choices} placeholder="Select option" onChange={action('onChange')} />
      </div>
    );
  }
  );
