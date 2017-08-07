import { formBuilderBoxMappingType } from 'constants/formBuilder';

const STANDARD = formBuilderBoxMappingType.STANDARD;

export const questionInputGroups = [
  {
    name: STANDARD,
    displayText: formBuilderBoxMappingType.STANDARD
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
    ],
    group: STANDARD,
    availableFields: [
      [
        {
          'displayName': 'ShortText',
          'key': 'short_text',
          'group': formBuilderBoxMappingType.STANDARD,
          'maxSelection': 10,
          'minSelection': 1
        }
      ]
    ]
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
    ],
    group: STANDARD,
    availableFields: [
      [
        {
          'displayName': 'Email',
          'key': 'email',
          'group': formBuilderBoxMappingType.STANDARD,
          'maxSelection': 1,
          'minSelection': 1
        }
      ]
    ]
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
    ],
    group: STANDARD,
    availableFields: [
      [
        {
          'displayName': 'Phone Number',
          'key': 'phone',
          'group': formBuilderBoxMappingType.STANDARD,
          'maxSelection': 1,
          'minSelection': 1
        }
      ]
    ]
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
    ],
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
    selectionTypes: [
      formBuilderBoxMappingType.BLOCK
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
    ],
    group: STANDARD,
    availableFields: [
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
    ]
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD,
      formBuilderBoxMappingType.BLOCK
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD
    ],
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
    selectionTypes: [],
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
    selectionTypes: [
      formBuilderBoxMappingType.STANDARD
    ],
    group: STANDARD
  }
};

export default questionInputs;
