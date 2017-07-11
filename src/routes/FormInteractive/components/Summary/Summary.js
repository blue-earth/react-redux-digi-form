import React, {
  Component,
  PropTypes
} from 'react';
import { FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';
import SubmitButton from 'components/Buttons/FormEnterButton';
import SubmissionReview from 'components/SubmissionReview';
import styles from './Summary.scss';

export default class Summary extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object,
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
    verificationStatus: PropTypes.array

  };

  handleFinalSubmit = () => {
    const { submitAnswer } = this.props;
    submitAnswer(FORM_USER_SUBMISSION);
  }

  render() {
    const { form: { questions }, answers } = this.props;
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.summaryTitle}>Summary</h2>
        <div className={styles.innerWrapper}>
          <div className={styles.submissionReviewWrapper}>
            <SubmissionReview questions={questions} answers={answers} />
          </div>
          <div className={styles.submitButtonWrapper}>
            <SubmitButton buttonLabel="SUBMIT APPLICATION" autoFocus onClick={this.handleFinalSubmit} />
          </div>
        </div>
      </div>
    );
  }

}

