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
     * value: Value to validate
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    /*
     * validations: validations to apply to the question.
     */
    validations: PropTypes.array.isRequired,
    /*
     * verifications: verification status of the question.
     */
    verifications: PropTypes.array.isRequired
  };

  static defaultProps = {
    validations: [],
    verifications: []
  }

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
    const { verifications } = this.props;
    const failedVerifications = _.filter(verifications, { status: false });
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
