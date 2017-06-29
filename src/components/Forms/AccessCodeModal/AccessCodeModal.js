import React, {
  Component,
  PropTypes
} from 'react';
import { Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import Validator from 'components/Validator/Validator';
import Verifier from 'components/Verifier/Verifier';
import validateField from 'helpers/validationHelper';
import SubmitButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import styles from './AccessCodeModal.scss';

class AccessCodeModal extends Component {

  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    formAccessCode: PropTypes.string,
    formAccessStatus: PropTypes.string,
    updateAccessCode: PropTypes.func,
    onSuccess: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    // When they are true/false, what are possible values?
    this.state = {
      accessCodeInputStatus: 'changing'   // prefer to use a boolean here, and name the variable to
                                          // isEnteringStatusCode, is this property needed
    };
  };

  handleAccessCodeInput = (value) => {
    const { updateAccessCode } = this.props;
    updateAccessCode(value);
    this.setState({
      accessCodeInputStatus: 'changing'
    });
  }

  handleFormAccess = () => {
    const { formAccessCode, onSuccess } = this.props;
    var isAccessCodeValid = validateField({type: 'minLength', value: 4}, formAccessCode) &&
    validateField({type: 'maxLength', value: 4}, formAccessCode);

    if (isAccessCodeValid) {
      this.setState({
        accessCodeInputStatus: 'validated'
      });
      onSuccess();
    } else {
      if (!validateField({type: 'minLength', value: 4}, formAccessCode)) {
        this.setState({ accessCodeInputStatus: 'minLengthUnvalidated' });
      } else {
        this.setState({ accessCodeInputStatus: 'maxLengthUnvalidated' });
      }
    }
  }

  render() {
    const { accessCodeInputStatus } = this.state;
    const { formAccessCode, show, formAccessStatus } = this.props;
    const showVerificationStatus = accessCodeInputStatus === 'validated';

    var optionals = {};
    if (this.context.primaryColour) {
      optionals['style'] = {
        color: this.context.primaryColour
      };
    }
    const accessCodeErrorText = 'Access Code must be 4 digits.';
    return (
      <Modal show={show} dialogClassName={styles.modalWrapper}>
        <div className={styles.accessModalWrapper}>
          Enter the 4 digit access code <br />to continue
          <div className={styles.modalDigitInput}>
            <ShortTextInput type="NumberField" value={formAccessCode}
              onChange={this.handleAccessCodeInput}
              autoFocus onEnterKey={this.handleFormAccess} />
          </div>
          <div className={styles.modalSubmitButton}>
            <SubmitButton onClick={this.handleFormAccess} />
          </div>
          <div className={styles.modalValidator}>
            {accessCodeInputStatus === 'minLengthUnvalidated' &&
              <Validator type="minLength" value={4} validateFor={formAccessCode}
                displayText={accessCodeErrorText} />
            }
            {accessCodeInputStatus === 'maxLengthUnvalidated' &&
              <Validator type="maxLength" value={4} validateFor={formAccessCode}
                displayText={accessCodeErrorText} />
            }
            {showVerificationStatus && formAccessStatus === 'fail' &&
              <Verifier type="AccessCodeService" status={formAccessStatus !== 'fail'} />
            }
          </div>
          <a href="javascript:;" className={styles.resendLink}
            {...optionals}>
            Resend access code
          </a>
        </div>
      </Modal>
    );
  }
}

export default connectModal({ name: 'accessCodeModal' })(AccessCodeModal);
