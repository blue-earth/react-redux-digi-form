import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AddressInput from './AddressInput';

storiesOf('Input', module)
  .add('Address input', () => {
    return (
      <div>
        <AddressInput autoFocus={true} />
      </div>
    );
  }
  );
