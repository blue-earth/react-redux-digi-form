import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import LongTextInput from './LongTextInput';
import './LongTextInput.scss';

storiesOf('Input', module)
  .add('Long text input', () => {
    return (
      <div style={{width: '500px'}}>
        <LongTextInput
          autoFocus
          value="Long text test"
          onFocus={action('focus')}
          onBlur={action('blur')}
          onEnterKey={action('enterKey')}
        />
        <LongTextInput placeholderText="Placeholder" />
      </div>
    );
  }
  );
