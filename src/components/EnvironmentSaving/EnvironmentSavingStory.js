import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EnvironmentSaving from './EnvironmentSaving';

storiesOf('Small Components', module)
  .add('Env Saving', () => {
    return (
      <EnvironmentSaving water={12} trees={0.3} co2={120} />
    );
  }
);
