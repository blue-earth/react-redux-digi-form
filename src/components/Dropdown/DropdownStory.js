import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Dropdown from './Dropdown';

storiesOf('Dropdown', module)
  .add('Select dropdown', () => {
    const options = [
    '',
      'sdkfls dflksdjfvln vslkakldjsf lsnvlksjdlkfjsdlf',
      'sdfsdfsdf sdfsdf sdfsdfsdff',
      '3', '4', '5', '6', '7', '8'];
    const defaultOption = options[0];
    return (
      <div style={{width: '500px'}}>
        <Dropdown className="dropdown" options={options} placeholder="Select option" onChange={action('onChange')} />
        <Dropdown className="dropdown" value={''} options={options} placeholder="Select option" onChange={action('onChange')} />
      </div>
    );
  }
  );
