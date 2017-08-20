import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Spinner from './Spinner';

storiesOf('Button', module)
  .add('Spinner', () => (
    <div>
      <button style={{width: '100px', height: '40px'}}>
        <Spinner />
      </button>
      <button style={{width: '200px', height: '64px'}}>
        <Spinner primaryColour="#3893d0" size="lg" />
      </button>
    </div>
  ));
