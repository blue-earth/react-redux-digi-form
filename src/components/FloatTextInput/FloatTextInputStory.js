import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TextInput from './TextInput';

storiesOf('Input', module)
  .add('Text Input', () => (
    <div style={{fontSize: '20px', width: '500px'}}>
      <TextInput id="test" placeholder="state" primaryColour={'#3993d1'} error={true} errorMessage={'test'} />
    </div>
  ));
