import React, {
  Component,
  PropTypes
} from 'react';
import Validator from '../../Validator';
import Verifier from '../../Verifier';
import validateField from 'helpers/validationHelper';
import _ from 'lodash';

class FieldError extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * questionId: Current question id.
     */
    questionId: PropTypes.number.isRequired,
    /*
     * value: Value to validate
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),
    /*
     * validations: validations to apply to the question.
     */
    validations: PropTypes.array.isRequired,
    /*
     * verificationStatus: verification status of the question.
     */
    verificationStatus: PropTypes.array.isRequired
  };

  getValidationErrors() {
    const { validations, value } = this.props;
    const failedValidations = _.filter(validations, function (validation) {
      return !validateField(validation, value);
    });

    return failedValidations.map((validation, index) => {
      return (
        <Validator {...validation} key={validation.type} validateFor={value} />
      );
    });
  }

  getVerificationErrors() {
    const { verificationStatus, questionId } = this.props;
    const failedVerifications = _.filter(verificationStatus, {
      id: questionId,
      status: false
    });
    return failedVerifications.map((verification, index) => {
      return (
        <Verifier type={verification.type} status={verification.status} key={verification.type} />
      );
    });
  }

  render() {
    return (
      <div className="fieldErrors">
        {this.getValidationErrors()}
        {this.getVerificationErrors()}
      </div>
    );
  }
}

export default FieldError;
