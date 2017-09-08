import React, {
  Component,
  PropTypes
} from 'react';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import _ from 'lodash';

class SignatureFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.setQuestionInfo({'question_instruction': 'Electronic Signature'});
  }

  render() {
    const {
      currentElement,
      setValidationInfo,
      resetValidationInfo
    } = this.props;
    const validations = currentElement.question['validations'];
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';
    return (<div>
      <RequiredValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        checked={isRequired}
      />
    </div>);
  }
}

export default SignatureFieldBasicTab;
