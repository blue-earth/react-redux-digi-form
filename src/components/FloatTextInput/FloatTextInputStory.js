import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FloatTextInput from './FloatTextInput';

storiesOf('Input', module)
  .add('Text Input', () => (
    <div style={{fontSize: '50px'}}>
      <FloatTextInput id="test" placeholder="state" primaryColour={'#3993d1'} error={true} errorMessage={'test'} />
    </div>
  ));
