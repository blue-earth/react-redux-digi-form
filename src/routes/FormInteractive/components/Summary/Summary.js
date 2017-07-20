import React, {
  Component,
  PropTypes
} from 'react';
import { FaPaperPlane } from 'react-icons/lib/fa';
import { Button } from 'react-bootstrap';
import { FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';
import IDVerificationModal from '../IDVerificationModal';
import SubmissionReview from 'components/SubmissionReview';
import styles from './Summary.scss';

export default class Summary extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * formId: Form ID
     */
    formId: PropTypes.number.isRequired,
    /*
     * sessionId: Session ID to fetch saved answer
     */
    sessionId: PropTypes.number,
    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object,
    /*
     * formConfig: form configuration data.
     */
    formConfig: PropTypes.object,
    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,
    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,
    /*
     * submitAnswer: Redux action to send submit request to server. Here it will be submitted by user's action.
     */
    submitAnswer: PropTypes.func.isRequired,
    /*
     * prefills: Redux state that stores the array of answer prefills values
     */
    prefills: PropTypes.array.isRequired,
    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired,
    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array,
    /*
     * params: Routing params
     */
    params: PropTypes.object,
    /*
     * goTo: Goes to specific url within page.
     */
    goTo: PropTypes.func.isRequired,

    /*
     * setIDVerifyStatus: Set ID verification related data and status
     */
    setIDVerifyStatus: PropTypes.func.isRequired
  };

  handleFinalSubmit = () => {
    const { submitAnswer } = this.props;
    submitAnswer(FORM_USER_SUBMISSION, this.handlePostSubmit);
  }

  handlePostSubmit = () => {
    const { formConfig: { idVerification }, showModal } = this.props;
    if (idVerification.isRequired) {
      showModal('idVerificationModal');
    } else {
      this.gotoCompletion();
    }
  }

  gotoCompletion = () => {
    const { goTo, params: { formIdSlug }, sessionId } = this.props;
    goTo(`/forms/${formIdSlug}/${sessionId}/completed`);
  }

  render() {
    const { form: { questions }, answers, showModal } = this.props;
    const { primaryColour } = this.context;
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.summaryTitle}>Summary</h2>
        <div className={styles.innerWrapper}>
          <div className={styles.submissionReviewWrapper}>
            <SubmissionReview questions={questions} answers={answers} showModal={showModal} />
          </div>
          <div className={styles.submitButtonWrapper}>
            <p className={styles.whenReady} style={{ color: primaryColour }}>
              When you're ready...
            </p>
            <Button onClick={this.handleFinalSubmit} className={styles.submitButton}
              style={{ backgroundColor: primaryColour }}>
              <FaPaperPlane size={28} />
              <span className={styles.buttonLabel}>Submit</span>
            </Button>
          </div>
        </div>
        <IDVerificationModal {...this.props} onLinkClick={this.gotoCompletion} />
      </div>
    );
  }

}

