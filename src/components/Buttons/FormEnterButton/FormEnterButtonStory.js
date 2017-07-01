import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FormEnterButton from './FormEnterButton';

storiesOf('Button', module)
  .add('Form Enter Button', () => (
    <FormEnterButton onClick={action('clicked')} />
  ));
