import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EnvironmentSaving from './EnvironmentSaving';

storiesOf('Small Components', module)
  .add('Env Saving', () => {
    return (
      <div>
        <div>
          <EnvironmentSaving type="trees" value={12} isWidget />
          <EnvironmentSaving type="co2" value={0.435} isWidget />
          <EnvironmentSaving type="water" value={1435} isWidget />
        </div>
        <div>
          <EnvironmentSaving type="trees" value={12} />
          <EnvironmentSaving type="co2" value={0.435} />
          <EnvironmentSaving type="water" value={1435} />
        </div>
      </div>
    );
  }
);
