import React from 'react';
import AnswerOutputArea from 'components/QuestionEditFields/AnswerOutputArea';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import LengthValidation from 'components/QuestionEditFields/LengthValidation';
import RangeValidation from 'components/QuestionEditFields/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';

export const getQuestionTypeConfigComponent = function (questionTypeName, tabName = 'general', componentProps) {
  switch (questionTypeName) {
    case 'ShortTextField':
    case 'EmailField':
    case 'LongTextField':
    case 'StatementField':
    case 'NumberField':
    case 'PhoneNumberField':
    case 'DropdownField':
    case 'MultipleChoiceField':
    case 'YesNoChoiceField':
    case 'DateField':
    case 'AddressField':
    case 'SignatureField':
      return (
        <div>
          <InstructionDescription {...componentProps} />
          <AnswerOutputArea {...componentProps} />
          <LengthValidation {...componentProps} />
          <RangeValidation {...componentProps} />
          <RequiredValidation {...componentProps} />
        </div>
      );
  }
};
