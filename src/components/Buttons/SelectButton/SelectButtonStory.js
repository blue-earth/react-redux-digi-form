import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SelectButton from './SelectButton';

const svg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="13" viewBox="0 0 13 13" fill="currentColor">
    <path id="checkbox"
      d="M450.787,2705.13a0.555,0.555,0,0,0-.794.09l-6.665,8.45-2.379-2.43a0.549,0.549,0,0,0-.8,0,0.58,0.58,
        0,0,0,0,.81l2.824,2.89a0.56,0.56,0,0,0,.839-0.04l7.058-8.96A0.583,0.583,0,0,0,450.787,2705.13Zm-2.049,
        5.36a0.573,0.573,0,0,0-.565.58v5.77h-9.035v-9.24h6.776a0.573,0.573,0,0,0,.565-0.58,0.564,0.564,0,0,
        0-.565-0.57h-7.341a0.564,0.564,0,0,0-.564.57v10.4a0.573,0.573,0,0,0,.564.58h10.165a0.573,0.573,0,0,
        0,.565-0.58v-6.35A0.573,0.573,0,0,0,448.738,2710.49Z"
      transform="translate(-438 -2705)" />
  </svg>);
storiesOf('Button', module)
  .add('Select Button', () => {
    const optionsList = [{
      key: 'form',
      label: 'Form'
    }, {
      key: 'other',
      label: 'Other type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }, {
      key: 'some',
      label: 'Some type'
    }
    ];
    const optionsListIcons = [{
      key: 'standard style',
      value: 'standard',
      label: <span>{svg} Standard style</span>
    }, {
      key: 'block style',
      value: 'block',
      label: <span>{svg} Block style</span>
    }];

    return (
      <div>
        <div style={{width: '200px'}}>
          <SelectButton label="Type" />
        </div>
        <p>Button</p>
        <div style={{width: '200px'}}>
          <SelectButton label="Type" optionsList={optionsList} value="Form" />
        </div>
        <p>general</p>
        <div>
          <SelectButton label="Type" optionsList={optionsList} value="Other type" isStaticValue />
        </div>
        <p>General with static value</p>
        <div>
          <SelectButton optionsList={optionsList} value="Form" />
        </div>
        <p>No label</p>
        <div>
          <SelectButton optionsList={optionsList} value="Actions" isStaticValue />
        </div>
        <p>No label with static value</p>
        <div>
          <SelectButton label={<div>{svg} Checkbox</div>} optionsList={optionsListIcons} value="standard" isValueHidden />
        </div>
        <p>Label with no display of value</p>
      </div>
    );
  }
);
