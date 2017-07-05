import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SelectButton from './SelectButton';

storiesOf('Button', module)
  .add('Select Button', () => {
    const optionList = [{
      key: 'form',
      eventKey: 'thisweek',
      label: 'Form'
    }, {
      key: 'other',
      eventKey: 'thisweek',
      label: 'Other type'
    }
    ];
    return (
      <SelectButton title="Type" label="Type" optionList={optionList} value="Form" />
    );
  }
);