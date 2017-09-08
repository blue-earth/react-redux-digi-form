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
  NameFieldBasicTab,
  NameFieldAdvancedTab
} from './NameField';
import {
  EmailFieldBasicTab,
  EmailFieldAdvancedTab
} from './EmailField';
import {
  AddressFieldBasicTab,
  AddressFieldAdvancedTab
} from './AddressField';
import {
  NumberFieldBasicTab,
  NumberFieldAdvancedTab
} from './NumberField';
import {
  PhoneNumberFieldBasicTab,
  PhoneNumberFieldAdvancedTab
} from './PhoneNumberField';
import {
  StatementFieldBasicTab,
  StatementFieldAdvancedTab
} from './StatementField';
import {
  DateFieldBasicTab,
  DateFieldAdvancedTab
} from './DateField';
import {
  UploadFieldBasicTab,
  UploadFieldAdvancedTab
} from './UploadField';
import {
  CheckboxFieldBasicTab,
  CheckboxFieldAdvancedTab
} from './CheckboxField';
import {
  SignatureFieldBasicTab,
  SignatureFieldAdvancedTab
} from './SignatureField';

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
    case 'NameField':
      if (tabName === 'general') {
        ConfigComponent = NameFieldBasicTab;
      } else {
        ConfigComponent = NameFieldAdvancedTab;
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
      if (tabName === 'general') {
        ConfigComponent = StatementFieldBasicTab;
      } else {
        ConfigComponent = StatementFieldAdvancedTab;
      }
      break;
    case 'NumberField':
      if (tabName === 'general') {
        ConfigComponent = NumberFieldBasicTab;
      } else {
        ConfigComponent = NumberFieldAdvancedTab;
      }
      break;
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
    case 'CheckboxField':
      if (tabName === 'general') {
        ConfigComponent = CheckboxFieldBasicTab;
      } else {
        ConfigComponent = CheckboxFieldAdvancedTab;
      }
      break;
    case 'DateField':
      if (tabName === 'general') {
        ConfigComponent = DateFieldBasicTab;
      } else {
        ConfigComponent = DateFieldAdvancedTab;
      }
      break;
    case 'AddressField':
      if (tabName === 'general') {
        ConfigComponent = AddressFieldBasicTab;
      } else {
        ConfigComponent = AddressFieldAdvancedTab;
      }
      break;
    case 'UploadField':
      if (tabName === 'general') {
        ConfigComponent = UploadFieldBasicTab;
      } else {
        ConfigComponent = UploadFieldAdvancedTab;
      }
      break;
    case 'SignatureField':
      if (tabName === 'general') {
        ConfigComponent = SignatureFieldBasicTab;
      } else {
        ConfigComponent = SignatureFieldAdvancedTab;
      }
      break;
  }
  return <ConfigComponent {...componentProps} />;
};
