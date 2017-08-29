import React, {
  Component,
  PropTypes
} from 'react';
import FloatTextInput from '../../QuestionInputs/FloatTextInput';
import DropdownInput from '../../QuestionInputs/Dropdown';
import FieldError from '../../QuestionInputs/FieldError';

import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice';
import YesNoChoice from '../../QuestionInputs/YesNoChoice/YesNoChoice';
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import AddressInput from '../../QuestionInputs/AddressInput/AddressInput';
import Signature from '../../QuestionInputs/Signature/Signature';
import FileUploadContainer from '../../QuestionInputs/FileUpload/FileUploadContainer';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class InteractiveInput extends Component {
  static propTypes = {

    /*
     * type: Question type.
     */
    type: PropTypes.string,

    /*
     * value: Question answer value
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),

    /*
     * validations: Validations required for the question, it is a part of form response.
     */
    validations: PropTypes.array,

    /*
     * verifications: Array of verifications status for the current question, ex. EmondoEmailService.
     */
    verifications: PropTypes.array
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  getQuestionInputComponent() {
    const { type } = this.props;
    var InputComponent = null;
    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'NumberField':
        InputComponent = FloatTextInput;
        break;
      case 'MultipleChoice':
        InputComponent = MultipleChoice;
        break;
      case 'YesNoChoiceField':
        InputComponent = YesNoChoice;
        break;
      case 'LongTextField':
        InputComponent = LongTextInput;
        break;
      case 'StatementField':
        InputComponent = Statement;
        break;
      case 'PhoneNumberField':
        InputComponent = PhoneNumberInput;
        break;
      case 'DropdownField':
        InputComponent = DropdownInput;
        break;
      case 'DateField':
        InputComponent = DateInput;
        break;
      case 'AddressField':
        InputComponent = AddressInput;
        break;
      case 'SignatureField':
        InputComponent = Signature;
        break;
      case 'FileUploadField':
        InputComponent = FileUploadContainer;
        break;
      default:
        InputComponent = (<p>`Question input not found for ${type}`</p>);
    }
    return InputComponent;
  }

  render() {
    var extraProps = {
      autoFocus: true,
      primaryColour: this.context.primaryColour,
      errorMessage: <FieldError {...this.props} />
    };
    const InputComponent = this.getQuestionInputComponent();
    return (
      <InputComponent {...this.props} {...extraProps} />
    );
  }

}

export default InteractiveInput;
