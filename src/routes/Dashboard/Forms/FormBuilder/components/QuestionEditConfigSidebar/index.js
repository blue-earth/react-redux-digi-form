import React from 'react';
import {
  ShortTextFieldBasicTab,
  ShortTextFieldAdvancedTab
} from './ShortTextField';
import {
  LongTextFieldBasicTab,
  LongTextFieldAdvancedTab
} from './LongTextField';
import {
  EmailFieldBasicTab,
  EmailFieldAdvancedTab
} from './EmailField';
import {
  PhoneNumberFieldBasicTab,
  PhoneNumberFieldAdvancedTab
} from './PhoneNumberField';

export const getQuestionTypeConfigComponent = function (questionTypeName, tabName = 'general', componentProps) {
  var ConfigComponent;
  switch (questionTypeName) {
    case 'ShortTextField':
      if (tabName === 'general') {
        ConfigComponent = ShortTextFieldBasicTab;
      } else {
        ConfigComponent = ShortTextFieldAdvancedTab;
      }
      break;
    case 'EmailField':
      if (tabName === 'general') {
        ConfigComponent = EmailFieldBasicTab;
      } else {
        ConfigComponent = EmailFieldAdvancedTab;
      }
      break;
    case 'LongTextField':
      if (tabName === 'general') {
        ConfigComponent = LongTextFieldBasicTab;
      } else {
        ConfigComponent = LongTextFieldAdvancedTab;
      }
      break;
    case 'StatementField':
    case 'NumberField':
    case 'PhoneNumberField':
      if (tabName === 'general') {
        ConfigComponent = PhoneNumberFieldBasicTab;
      } else {
        ConfigComponent = PhoneNumberFieldAdvancedTab;
      }
      break;
    case 'DropdownField':
    case 'MultipleChoiceField':
    case 'YesNoChoiceField':
    case 'DateField':
    case 'AddressField':
    case 'SignatureField':
      break;
  }
  return <ConfigComponent {...componentProps} />;
};
