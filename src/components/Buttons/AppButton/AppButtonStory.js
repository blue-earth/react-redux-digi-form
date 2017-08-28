import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AppButton from './AppButton';

storiesOf('Button', module)
  .add('Primary Button', () => (
    <div>
      <p>
        standard:
        <AppButton onClick={action('clicked')}>Primary Button</AppButton>
        <AppButton type="secondary" onClick={action('clicked')}>Secondary Button</AppButton>
        <AppButton type="additional" onClick={action('clicked')}>Additional Button</AppButton>
      </p>
      <p>
        big:
        <AppButton size="lg" onClick={action('clicked')}>Primary Button</AppButton>
        <AppButton size="lg" type="secondary" onClick={action('clicked')}>Secondary Button</AppButton>
        <AppButton size="lg" type="additional" onClick={action('clicked')}>Additional Button</AppButton>
      </p>
      <p>
        small:
        <AppButton size="sm" onClick={action('clicked')}>Primary button</AppButton>
        <AppButton size="sm" type="secondary" onClick={action('clicked')}>Secondary button</AppButton>
        <AppButton size="sm" type="additional" onClick={action('clicked')}>Additional button</AppButton>
      </p>
      <p>
        busy:
        <AppButton size="lg" onClick={action('clicked')} isBusy>Primary button</AppButton>
        <AppButton type="secondary" onClick={action('clicked')} isBusy>Secondary button</AppButton>
        <AppButton size="sm" type="additional" onClick={action('clicked')} isBusy>Additional button</AppButton>
      </p>
      <p>
        Content busy:
        <AppButton size="lg" onClick={action('clicked')} isBusy>a</AppButton>
        <AppButton type="secondary" onClick={action('clicked')} isBusy>a</AppButton>
        <AppButton size="sm" type="additional" onClick={action('clicked')} isBusy>a</AppButton>
      </p>
      <p>
        Content succeed:
        <AppButton size="lg" onClick={action('clicked')} isSucceed>a</AppButton>
        <AppButton type="secondary" onClick={action('clicked')} isSucceed>a</AppButton>
        <AppButton size="sm" type="additional" onClick={action('clicked')} isSucceed>a</AppButton>
      </p>
    </div>
  ));
