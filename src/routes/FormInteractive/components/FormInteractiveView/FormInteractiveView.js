import React, {
  Component,
  PropTypes
} from 'react';
import {
  LeftNavButton,
  RightNavButton
} from '../NavButton';
import Hogan from 'hogan.js';
import QuestionInteractive from 'components/Questions/QuestionInteractive';
import { MdKeyboardBackspace } from 'react-icons/lib/md';
import {
  getContextFromAnswer,
  shouldDisableNextButton,
  shouldDisablePrevButton,
  stringifyAnswerValue,
  transformQuestions
} from 'helpers/formInteractiveHelper';
import {
  findIndexById,
  findItemById
} from 'helpers/pureFunctions';
import styles from './FormInteractiveView.scss';
import _ from 'lodash';

class FormInteractiveView extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
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
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,
    /*
     * goToQuestion: Redux action to move to specific question by ID.
     */
    goToQuestion: PropTypes.func.isRequired,
    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,
    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired,
    /*
     * isVerifying: Redux state that indicates the status whether verification is in prgress with backend
     */
    isVerifying: PropTypes.bool.isRequired,
    /*
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func.isRequired,
    /*
     * prevQuestion: Redux action to move to previous question.
     */
    prevQuestion: PropTypes.func.isRequired,
    /*
     * prefills: Redux state that stores the array of answer prefills values
     */
    prefills: PropTypes.array.isRequired,
    /*
     * show: Redux modal show
     */
    showModal: PropTypes.func.isRequired,
    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array

  };

  constructor(props) {
    super(props);
    this.state = {
      questions: props.form ? transformQuestions(props.form.questions) : []
    };
  }

  compileTemplate(template, context) {
    if (template) {
      var t = Hogan.compile(template);
      return t.render(context);
    } else {
      return '';
    }
  }

  renderCurrentQuestion() {
    const { currentQuestionId, verificationStatus,
      answers, prefills, storeAnswer, nextQuestion, handleEnter, isVerifying, showModal } = this.props;
    const { questions } = this.state;
    const question = findItemById(questions, currentQuestionId);
    const context = getContextFromAnswer(answers);
    const answer = _.find(answers, {id: question.id});
    var optionals = {};
    if (typeof answer === 'object') {
      optionals['value'] = answer.value;
    } else {
      const prefill = _.find(prefills, {id: question.id});
      if (typeof prefill === 'object') optionals['value'] = prefill.value;
    }
    const finalQuestion = _.merge({}, question, {
      questionInstruction: this.compileTemplate(question.questionInstruction, context),
      questionDescription: this.compileTemplate(question.questionDescription, context)
    });
    return (
      <div className={styles.currentQuestionWrapper}>
        <QuestionInteractive
          {...finalQuestion}
          key={question.id}
          verificationStatus={verificationStatus}
          storeAnswer={storeAnswer}
          nextQuestion={nextQuestion}
          handleEnter={handleEnter}
          isVerifying={isVerifying}
          show={showModal}
          status="current"
          {...optionals}
        />
      </div>
    );
  }

  renderPrevQuestion() {
    const { answers, currentQuestionId } = this.props;
    const { questions } = this.state;
    const currentQuestionIndex = findIndexById(questions, currentQuestionId);
    if (currentQuestionIndex <= 0) return false;
    const prevQuestionIndex = currentQuestionIndex - 1;
    const question = questions[prevQuestionIndex];
    const answer = _.find(answers, {id: question.id});
    if (question.type === 'Group') return false;
    const context = getContextFromAnswer(answers);
    const answerText = stringifyAnswerValue(answer);
    return (
      <div className={styles.prevQuestionWrapper}>
        <h3 className={styles.neighborInstruction}>
          {this.compileTemplate(question.questionInstruction, context)}
        </h3>
        {answerText &&
          <div className={styles.prevQuestionAnswer}>
            <span className={styles.answerIcon}>
              <MdKeyboardBackspace size={24} />
            </span>
            {answerText}
          </div>
        }
      </div>
    );
  }

  renderNextQuestion() {
    const { answers, currentQuestionId, form } = this.props;
    if (shouldDisableNextButton(form, currentQuestionId)) return false;
    const { questions } = this.state;
    const currentQuestionIndex = findIndexById(questions, currentQuestionId);
    const prevQuestionIndex = currentQuestionIndex + 1;
    const question = questions[prevQuestionIndex];
    if (question.type === 'Group') return false;
    const context = getContextFromAnswer(answers);
    return (
      <div className={styles.nextQuestionWrapper}>
        <h3 className={styles.neighborInstruction}>
          {this.compileTemplate(question.questionInstruction, context)}
        </h3>
      </div>
    );
  }

  renderNavButtons() {
    const { form, currentQuestionId, isVerifying, prevQuestion, nextQuestion } = this.props;

    return (
      <ul className={styles.navButtonsWrapper}>
        <li>
          <LeftNavButton className={styles.navButton} onClick={function () { prevQuestion(); }}
            isDisabled={shouldDisablePrevButton(form, currentQuestionId) || isVerifying} />
        </li>
        <li>
          <RightNavButton className={styles.navButton} onClick={function () { nextQuestion(); }}
            isDisabled={shouldDisableNextButton(form, currentQuestionId) || isVerifying} />
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.wrapperInner}>
          {this.renderPrevQuestion()}
          {this.renderCurrentQuestion()}
          {this.renderNextQuestion()}
          {this.renderNavButtons()}
        </div>
      </div>
    );
  }

}

export default FormInteractiveView;
