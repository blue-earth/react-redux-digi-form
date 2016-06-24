export const questionInputGroups = [
  {
    name: 'standard',
    displayText: 'Standard'
  },
  {
    name: 'advanced',
    displayText: 'Advanced'
  },
  {
    name: 'signature',
    displayText: 'Signature'
  },
  {
    name: 'pricing',
    displayText: 'Pricing'
  }
];

const questionInputs = [
  {
    name: 'ShortTextField',
    componentName: 'ShortTextInput',
    displayText: 'Short Text',
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
    group: 'standard'
  },
  {
    name: 'NumberField',
    componentName: 'ShortTextInput',
    displayText: 'Number',
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
    group: 'standard'
  },
  {
    name: 'EmailField',
    componentName: 'ShortTextInput',
    displayText: 'Email',
    inputType: 'email',
    validations: [
      'is_required',
      'is_email',
    ], 
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'less_than',
      'greater_than',
      'less_than_equal_to',
      'greater_than_equal_to'
    ],
    group: 'standard'
  },
  {
    name: 'LongTextField',
    componentName: 'LongTextInput',
    displayText: 'Long Text',
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
      'does_not_contain',
    ],
    group: 'standard'
  },
  {
    name: 'MultipleChoice',
    componentName: 'MultipleChoice',
    displayText: 'Multiple Choice',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: 'standard'
  },
  {
    name: 'DropdownField',
    componentName: 'DropdownInput',
    displayText: 'Dropdown',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: 'standard'
  },
  {
    name: 'YesNoChoice',
    componentName: 'YesNoChoice',
    displayText: 'Yes / No',
    validations: [
      'is_required'
    ],
    logicOperations: [
      'is',
      'not'
    ],
    group: 'standard'
  },
  {
    name: 'StatementField',
    componentName: 'Statement',
    displayText: 'Statement',
    validations: [],
    logicOperations: [],
    group: 'pricing'
  },
  {
    name: 'AddressField',
    componentName: 'AddressInput',
    displayText: 'Address',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: 'advanced'
  },
  {
    name: 'DateField',
    componentName: 'DateInput',
    displayText: 'Date',
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
    group: 'advanced'
  },
  {
    name: 'PhoneNumberField',
    componentName: 'PhoneNumberInput',
    displayText: 'Phone Number',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: 'advanced'
  },
  {
    name: 'SignatureField',
    componentName: 'Signature',
    displayText: 'Signature',
    validations: [
      'is_required'
    ],
    logicOperations: [],
    group: 'signature'
  }
];

export default questionInputs;
