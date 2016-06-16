export const questionInputs = [
  {
    id: 'ShortTextField',
    componentName: 'ShortTextInput',
    displayText: 'Short Text',
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'begins_with',
      'ends_with',
      'contains',
      'does_not_contain'
    ]
  },
  {
    id: 'LongTextField',
    componentName: 'LongTextInput',
    displayText: 'Long Text',
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'begins_with',
      'ends_with',
      'contains',
      'does_not_contain',
    ]
  },
  {
    id: 'NumberField',
    componentName: 'ShortTextInput',
    displayText: 'Number',
    logicOperations: [
      'equal_to',
      'not_equal_to',
      'less_than',
      'greater_than',
      'less_than_equal_to',
      'greater_than_equal_to'
    ]
  },
  {
    id: 'MultipleChoice',
    componentName: 'MultipleChoice',
    displayText: 'Multiple Choice',
    logicOperations: [
      'is',
      'not'
    ]
  }
];
