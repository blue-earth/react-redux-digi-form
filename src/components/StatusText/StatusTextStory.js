import React from 'react';
import { storiesOf } from '@kadira/storybook';
import StatusText from './StatusText';

storiesOf('Form submission status text', module)
  .add('Received', () => (
    <div><StatusText status="Received" /></div>
  ))
  .add('Edited', () => (
    <div><StatusText status="Edited" /></div>
  ))
  .add('Saved', () => (
    <div><StatusText status="Saved" /></div>
  ))
  .add('Abandoned', () => (
    <div><StatusText status="Abandoned" /></div>
  ))
  .add('Accepted', () => (
    <div><StatusText status="Accepted" /></div>
  ))
  .add('Cancelled', () => (
    <div><StatusText status="Cancelled" /></div>
  ))
  .add('this status does not exist', () => (
    <div><StatusText status="Pineapple" /></div>
  ));
