const STANDARD = 'standard';

export const questionInputGroups = [
  {
    name: STANDARD,
    displayText: 'Standard'
  }
];

/**
 * ``name`` is used as identifier, change carefully!
 * ``displayText`` is used to display on the QuestionTypePanel
 */

const questionInputs = {
  'ShortTextField': {
    name: 'ShortTextField',
    componentName: 'ShortTextInput',
    displayText: 'Short Text',
    displayIcon: 'ShortText',
    inputType: 'text',
    validations: [
      'is_required',
      'min_length',
      'max_length'
    ],
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'begins_with',
      'ends_with',
      'contains',
      'does_not_contain'
    ],
    group: STANDARD
  },
  'EmailField': {
    name: 'EmailField',
    componentName: 'ShortTextInput',
    displayText: 'Email',
    displayIcon: 'Email',
    inputType: 'email',
    validations: [
      'is_required',
      'is_email'
    ],
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'less_than',
      'greater_than',
      'less_than_equal_to',
      'greater_than_equal_to'
    ],
    group: STANDARD
  },
  'PhoneNumberField': {
    name: 'PhoneNumberField',
    componentName: 'PhoneNumberInput',
    displayText: 'Phone Number',
    displayIcon: 'Phone',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: STANDARD
  },
  'AddressField': {
    name: 'AddressField',
    componentName: 'AddressInput',
    displayText: 'Address',
    displayIcon: 'Address',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: STANDARD
  },
  'YesNoChoice': {
    name: 'YesNoChoice',
    componentName: 'YesNoChoice',
    displayText: 'Checkbox',
    displayIcon: 'Checkbox',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: STANDARD
  },
  'DateField': {
    name: 'DateField',
    componentName: 'DateInput',
    displayText: 'Date',
    displayIcon: 'Date',
    defaultDateFormat: 'YYYY/MM/DD',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'on',
      'not_on',
      'before',
      'after',
      'before_on',
      'after_on'
    ],
    group: STANDARD
  },
  'MultipleChoice': {
    name: 'MultipleChoice',
    componentName: 'MultipleChoice',
    displayText: 'Multiple Choice',
    displayIcon: 'List',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: STANDARD
  },
  'NumberField': {
    name: 'NumberField',
    componentName: 'ShortTextInput',
    displayText: 'Number',
    displayIcon: 'Number',
    inputType: 'number',
    validations: [
      'is_required',
      'minimum',
      'maximum'
    ],
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'less_than',
      'greater_than',
      'less_than_equal_to',
      'greater_than_equal_to'
    ],
    group: STANDARD
  },
  'LongTextField': {
    name: 'LongTextField',
    componentName: 'LongTextInput',
    displayText: 'Paragraph',
    displayIcon: 'Paragraph',
    validations: [
      'is_required',
      'minimum',
      'maximum'
    ],
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'begins_with',
      'ends_with',
      'contains',
      'does_not_contain'
    ],
    group: STANDARD
  },
  'DropdownField': {
    name: 'DropdownField',
    componentName: 'DropdownInput',
    displayText: 'Dropdown',
    displayIcon: 'Dropdown',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: STANDARD
  },
  'StatementField': {
    name: 'StatementField',
    componentName: 'Statement',
    displayText: 'Legal',
    displayIcon: 'Legal',
    validations: [],
    logicOperations: [],
    group: STANDARD
  },
  'UploadField': {
    name: 'UploadField',
    componentName: 'FileUpload',
    displayText: 'Upload',
    displayIcon: 'Upload',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: STANDARD
  },
  'SignatureField': {
    name: 'SignatureField',
    componentName: 'Signature',
    displayText: 'Signature',
    displayIcon: 'Signature',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: STANDARD
  }
};

export default questionInputs;
