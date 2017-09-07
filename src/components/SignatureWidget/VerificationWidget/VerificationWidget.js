import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Row,
  Col
} from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import styles from './VerificationWidget.scss';

class VerificationWidget extends Component {
  static propTypes = {
    closeWidget: PropTypes.func,
    value: PropTypes.object,
    errors: PropTypes.array,
    resetErrors: PropTypes.func,
    isInputLocked: PropTypes.bool,
    verificationStatus: PropTypes.string,
    verifyCode: PropTypes.func.isRequired,
    resendCode: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  handleChange = (event) => {
    this.setState({
      code: event.target.value
    });
    this.props.resetErrors('code');
  }

  handleSubmit = () => {
    if (this.state.code) {
      this.props.verifyCode(this.state.code);
    }
  }

  render() {
    const { value, errors, isInputLocked, verificationStatus } = this.props;
    const { code } = this.state;
    return (
      <div className={styles.completionModal}>
        <div>
          <h3 className={styles.modalHeader}>
              Enter signature completion code
          </h3>
        </div>
        <Row>
          <Col sm={8} smPush={2}>
            <p className={styles.info}>
              The signature code has been sent to {value.email}.
              {' '}
              <a href="javascript:;" className={styles.resendButton} onClick={this.props.resendCode}>Resend?</a>
            </p>
            <input placeholder="Code" className={styles.codeInput} value={code} onChange={this.handleChange} />
            <div className={styles.errorMessage}>
              {errors.length > 0 && <span>Please input valid code</span>}
            </div>
            <div className={styles.buttonWrapper}>
              <AppButton
                size="lg"
                extraClass={styles.completeButton}
                onClick={this.handleSubmit}
                isDisabled={isInputLocked}
                isBusy={verificationStatus === 'verifying'}
                isSucceed={verificationStatus === 'success'}>
                Complete
              </AppButton>
            </div>
            <Button onClick={this.props.closeWidget} bsStyle="link" className={styles.cancelButton}>
              Go back
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default VerificationWidget;
