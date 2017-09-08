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

export const shortTextFieldSchema = {
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
};

export const nameFieldSchema = {
  name: 'NameField',
  componentName: 'NameInput',
  displayText: 'Name',
  displayIcon: 'ShortText',
  inputType: 'text',
  validations: [
    'is_required'
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
        'displayName': 'First name',
        'key': 'first_name',
        'group': formBuilderBoxMappingType.STANDARD
      },
      {
        'displayName': 'Middle name',
        'key': 'middle_name',
        'group': formBuilderBoxMappingType.STANDARD
      },
      {
        'displayName': 'Last name',
        'key': 'last_name',
        'group': formBuilderBoxMappingType.STANDARD
      }
    ]
  ]
};

export const emailFieldSchema = {
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
};

export const phoneNumberFieldSchema = {
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
};

export const addressFieldSchema = {
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
};

export const yesNoChoiceSchema = {
  name: 'YesNoChoice',
  componentName: 'YesNoChoice',
  displayText: 'Yes/No Choice',
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
};

export const checkboxSchema = {
  name: 'CheckboxField',
  componentName: 'Checkbox',
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
    formBuilderBoxMappingType.STANDARD
  ],
  group: STANDARD,
  availableFields: []
};

export const dateFieldSchema = {
  name: 'DateField',
  componentName: 'DateInput',
  displayText: 'Date',
  displayIcon: 'Date',
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
        'key': 'month_year',
        'group': 'Combined'
      },
      {
        'displayName': 'Year/Month/Day',
        'key': 'year_month_day',
        'group': 'Combined'
      },
      {
        'displayName': 'Day/Month/Year',
        'key': 'day_month_year',
        'group': 'Combined'
      },
      {
        'displayName': 'Month/Day/Year',
        'key': 'month_day_year',
        'group': 'Combined'
      }
    ]
  ]
};

export const multipleChoiceSchema = {
  name: 'MultipleChoiceField',
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
};

export const numberFieldSchema = {
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
  group: STANDARD,
  availableFields: [
    [
      {
        'displayName': 'Number',
        'key': 'number',
        'group': formBuilderBoxMappingType.STANDARD,
        'maxSelection': 10,
        'minSelection': 1
      }
    ]
  ]
};

export const longTextFieldSchema = {
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
  group: STANDARD,
  availableFields: [
    [
      {
        'displayName': 'Paragraph',
        'key': 'long_text',
        'group': formBuilderBoxMappingType.STANDARD,
        'maxSelection': 1,
        'minSelection': 1
      }
    ]
  ]
};

export const dropdownFieldSchema = {
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
};

export const statementFieldSchema = {
  name: 'StatementField',
  componentName: 'Statement',
  displayText: 'Statement',
  displayIcon: 'Legal',
  validations: [],
  logicOperations: [],
  selectionTypes: [
    formBuilderBoxMappingType.STANDARD
  ],
  group: STANDARD,
  availableFields: [
    [
      {
        'displayName': 'Statement',
        'key': 'statement',
        'group': formBuilderBoxMappingType.STANDARD,
        'maxSelection': 1,
        'minSelection': 1
      }
    ]
  ]
};

export const uploadFieldSchema = {
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
};

export const signatureFieldSchema = {
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
  group: STANDARD,
  availableFields: [
    [
      {
        'displayName': 'Signature',
        'key': 'signature',
        'group': formBuilderBoxMappingType.STANDARD,
        'maxSelection': 1,
        'minSelection': 1
      }
    ]
  ]
};

export const questionInputSchemas = {
  shortTextFieldSchema,
  nameFieldSchema,
  emailFieldSchema,
  phoneNumberFieldSchema,
  addressFieldSchema,
  checkboxSchema,
  yesNoChoiceSchema,
  dateFieldSchema,
  multipleChoiceSchema,
  numberFieldSchema,
  longTextFieldSchema,
  dropdownFieldSchema,
  statementFieldSchema,
  uploadFieldSchema,
  signatureFieldSchema
};

export function getQuestionInputSchema(questionTypeName) {
  switch (questionTypeName) {
    case 'ShortTextField':
      return shortTextFieldSchema;
    case 'NameField':
      return nameFieldSchema;
    case 'EmailField':
      return emailFieldSchema;
    case 'LongTextField':
      return longTextFieldSchema;
    case 'StatementField':
      return statementFieldSchema;
    case 'NumberField':
      return numberFieldSchema;
    case 'PhoneNumberField':
      return phoneNumberFieldSchema;
    case 'DropdownField':
      return dropdownFieldSchema;
    case 'MultipleChoiceField':
      return multipleChoiceSchema;
    case 'CheckboxField':
      return checkboxSchema;
    case 'YesNoChoiceField':
      return yesNoChoiceSchema;
    case 'DateField':
      return dateFieldSchema;
    case 'AddressField':
      return addressFieldSchema;
    case 'SignatureField':
      return signatureFieldSchema;
    case 'UploadField':
      return uploadFieldSchema;
  }
}
