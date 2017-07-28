import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import DocumentFieldsSelectionHeader from './DocumentFieldsSelectionHeader';

storiesOf('FormBuilder', module)
  .add('DocumentFieldsSelectionHeader', () => {
    const dateFields = [
      [
        {
          'displayName': 'Day',
          'key': 'day',
          'group': 'Separate'
        },
        {
          'displayName': 'Month',
          'key': 'month',
          'group': 'Separate'
        },
        {
          'displayName': 'Year',
          'key': 'year',
          'group': 'Separate'
        }
      ],
      [
        {
          'displayName': 'Month/Year',
          'key': 'month/year',
          'group': 'Combined'
        },
        {
          'displayName': 'Year/Month/Day',
          'key': 'year/month/day',
          'group': 'Combined'
        },
        {
          'displayName': 'Day/Month/Year',
          'key': 'day/month/year',
          'group': 'Combined'
        },
        {
          'displayName': 'Month/Day/Year',
          'key': 'month/day/year',
          'group': 'Combined'
        }
      ]
    ];
    return (
      <div>
        <h3>Date</h3>
        <DocumentFieldsSelectionHeader
          shortDescription="Date: Standard Style"
          availableFields={dateFields}
        />
        <h3>ShortText (Mapping active)</h3>
        <h3>ShortText (Mapping completed)</h3>
        <h3>Date</h3>
      </div>
    );
  });
