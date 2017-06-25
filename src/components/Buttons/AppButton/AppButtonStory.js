import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AppButton from './AppButton';


storiesOf('Button', module)
  .add('Primary Button', () => (
    <AppButton onClick={action('clicked')}>Primary button</AppButton>
  ));
