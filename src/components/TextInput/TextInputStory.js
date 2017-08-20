import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TextInput from './TextInput';

storiesOf('Text Input', module)
  .add('default', () => (
    <TextInput />
  ))
  .add('extras', () => (
    <TextInput placeholderText="enter your text" label="some label" prefix="i'm a prefix"
      helpText="This is some helpfull text." />
  ))
  .add('error', () => (
    <TextInput placeholderText="enter your text" hasError />
  ))
  .add('disabled', () => (
    <TextInput isDisabled placeholderText="no enter your text" />
  ))
  .add('read only', () => (
    <TextInput isReadOnly value="some value" />
  ));
