import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EnvironmentSaving from './EnvironmentSaving';

storiesOf('Small Components', module)
  .add('Env Saving', () => {
    return (
      <div>
        <EnvironmentSaving number="0.34" label="trees" imageSrc="http://localhost:8000/static/images/tree.png" />
        <EnvironmentSaving number="0.56" label="kilograms of CO2" imageSrc="http://localhost:8000/static/images/co2.png" />
        <EnvironmentSaving number="1.56" label="liters of water" imageSrc="http://localhost:8000/static/images/water.png" />
      </div>
    );
  }
);
