import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SubmissionStatus from './SubmissionStatus';

storiesOf('Form submission status text', module)
  .add('Received', () => (
    <div><SubmissionStatus status="Received" /></div>
  ))
  .add('Edited', () => (
    <div><SubmissionStatus status="Edited" /></div>
  ))
  .add('Saved', () => (
    <div><SubmissionStatus status="Saved" /></div>
  ))
  .add('Abandoned', () => (
    <div><SubmissionStatus status="Abandoned" /></div>
  ))
  .add('Accepted', () => (
    <div><SubmissionStatus status="Accepted" /></div>
  ))
  .add('Cancelled', () => (
    <div><SubmissionStatus status="Cancelled" /></div>
  ))
  .add('this status does not exist', () => (
    <div><SubmissionStatus status="Pineapple" /></div>
  ));
