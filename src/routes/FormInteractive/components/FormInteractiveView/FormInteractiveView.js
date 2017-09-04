import React, {
  Component,
  PropTypes
} from 'react';
import {
  LeftNavButton,
  RightNavButton
} from '../NavButton';
import classNames from 'classnames';
import Hogan from 'hogan.js';
import QuestionInteractive from 'components/Questions/QuestionInteractive';
import FormEnterButton from 'components/Buttons/FormEnterButton';
import { MdKeyboardBackspace } from 'react-icons/lib/md';
import {
  compileTemplate,
  getContextFromAnswer,
  shouldDisableNextButton,
  shouldDisablePrevButton,
  transformQuestions
} from 'helpers/formInteractiveHelper';
import {
  findIndexById,
  findItemById
} from 'helpers/pureFunctions';
import AnswerValue from 'components/AnswerValue';
import styles from './FormInteractiveView.scss';
import _ from 'lodash';

class FormInteractiveView extends Component {
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
     * changeCurrentState: Redux action to change the update the current answer value on change,
     * input state to redux store.
     */
    changeCurrentState: PropTypes.func.isRequired,
    /*
     * currentQuestion: Redux state that keeps the current active question id and answer.
     */
    currentQuestion: PropTypes.object.isRequired,
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
     * goToNextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    goToNextQuestion: PropTypes.func.isRequired,
    /*
     * goToPrevQuestion: Redux action to move to previous question.
     */
    goToPrevQuestion: PropTypes.func.isRequired,
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

    formId: PropTypes.number,
    sessionId: PropTypes.number

  };

  constructor(props) {
    super(props);
    this.state = {
      questions: props.form ? transformQuestions(props.form.questions) : []
    };
  }

  valueIsVerified() {
    const { currentQuestion, verificationStatus, isVerifying } = this.props;
    if (isVerifying) return false;
    const unavailables = _.filter(verificationStatus, {
      id: currentQuestion.id,
      status: false
    });
    return unavailables.length === 0;
  }

  get enterButtonClass() {
    const { currentQuestion } = this.props;
    const { questions } = this.state;
    const question = findItemById(questions, currentQuestion.id);
    const { type, allowMultiple } = question;
    var shouldHideButton = false;
    switch (type) {
      case 'MultipleChoice':
        shouldHideButton = !allowMultiple;
        break;
      case 'DropdownField':
        shouldHideButton = true;
        break;
    }
    return classNames({
      'hide': shouldHideButton
    });
  }

  getStoreAnswerByQuestionId = (questionId) => {
    const { answers } = this.props;
    var answerResult = answers.filter((answer) => answer.id === questionId);
    if (answerResult.length) {
      return answerResult[0].value;
    } else {
      return null;
    }
  };

  handleEnter = () => {
    // We only do validation and verification on enter, onChange submits the answer if valid.
    const { handleEnter, currentQuestion } = this.props;
    const { questions } = this.state;
    const question = findItemById(questions, currentQuestion.id);
    if (!question) {
      return false;
    }
    handleEnter();
  };

  shouldPrefillValue() {
    const { currentQuestion } = this.props;
    return !currentQuestion.answerValue;
  }

  renderCurrentQuestion() {
    const { currentQuestion, verificationStatus, changeCurrentState,
      answers, prefills, storeAnswer, isVerifying, showModal } = this.props;
    const { questions } = this.state;
    const question = findItemById(questions, currentQuestion.id);
    const context = getContextFromAnswer(answers);
    var optionals = {};
    if (currentQuestion.answerValue) {
      optionals['value'] = currentQuestion.answerValue;
    }
    if (this.shouldPrefillValue()) {
      const prefill = _.find(prefills, {id: question.id});
      if (typeof prefill === 'object') optionals['value'] = prefill.value;
    }
    const finalQuestion = _.merge({}, question, {
      questionInstruction: compileTemplate(question.questionInstruction, context),
      questionDescription: compileTemplate(question.questionDescription, context)
    });
    const filteredVerifications = _.filter(verificationStatus, { id: question.id });
    return (
      <div className={styles.currentQuestionRow}>
        <div className={styles.currentQuestionCell}>
          <QuestionInteractive
            question={finalQuestion}
            key={question.id}
            verifications={filteredVerifications}
            changeCurrentState={changeCurrentState}
            storeAnswer={storeAnswer}
            handleEnter={this.handleEnter}
            isVerifying={isVerifying}
            showModal={showModal}
            getStoreAnswerByQuestionId={this.getStoreAnswerByQuestionId}
            formId={this.props.formId}
            sessionId={this.props.sessionId}
            {...optionals}
          />
        </div>
      </div>
    );
  }

  renderPrevQuestion() {
    const { answers, currentQuestion } = this.props;
    const { questions } = this.state;
    const currentQuestionIndex = findIndexById(questions, currentQuestion.id);
    if (currentQuestionIndex <= 0) return false;
    const prevQuestionIndex = currentQuestionIndex - 1;
    const question = questions[prevQuestionIndex];
    const answer = _.find(answers, {id: question.id});
    if (question.type === 'Group') return false;
    const context = getContextFromAnswer(answers);
    return (
      <div className={styles.prevQuestionRow}>
        <div className={styles.prevQuestionCell}>
          <h3 className={styles.neighborInstruction}>
            {compileTemplate(question.questionInstruction, context)}
          </h3>
          {answer &&
            <div className={styles.prevQuestionAnswer}>
              <span className={styles.answerIcon}>
                <MdKeyboardBackspace size={24} />
              </span>
              <AnswerValue value={answer.value} question={question} />
            </div>
          }
        </div>
      </div>
    );
  }

  renderNextQuestion() {
    const { answers, currentQuestion, form } = this.props;
    if (shouldDisableNextButton(form, currentQuestion.id)) return false;
    const { questions } = this.state;
    const currentQuestionIndex = findIndexById(questions, currentQuestion.id);
    const nextQuestionIndex = currentQuestionIndex + 1;
    const question = questions[nextQuestionIndex];
    if (!question || question.type === 'Group') return false;
    const context = getContextFromAnswer(answers);
    return (
      <div className={styles.nextQuestionRow}>
        <div className={styles.nextQuestionCell}>
          <h3 className={styles.neighborInstruction}>
            {compileTemplate(question.questionInstruction, context)}
          </h3>
        </div>
      </div>
    );
  }

  renderEnterbutton() {
    const { isVerifying } = this.props;
    const mobileEnterButton = (<FormEnterButton
      onClick={this.handleEnter}
      isDisabled={isVerifying}
      displayIcon={false}
      buttonLabel="SUBMIT"
    />);
    const desktopEnterButton = (<FormEnterButton
      onClick={this.handleEnter}
      isDisabled={isVerifying}
    />);
    return (
      <div>
        <div className={styles.visibleTabletDesktop}>{desktopEnterButton}</div>
        <div className={styles.visibleMobile}>{mobileEnterButton}</div>
      </div>
    );
  }

  renderNavButtons() {
    const { form, currentQuestion, isVerifying, goToPrevQuestion, goToNextQuestion } = this.props;

    return (
      <div className={styles.navButtonsWrapper}>
        <ul className={styles.arrowNavs}>
          <li>
            <LeftNavButton className={styles.navButton} onClick={goToPrevQuestion}
              isDisabled={shouldDisablePrevButton(form, currentQuestion.id) || isVerifying} />
          </li>
          <li>
            <RightNavButton className={styles.navButton} onClick={goToNextQuestion}
              isDisabled={shouldDisableNextButton(form, currentQuestion.id) || isVerifying} />
          </li>
          <li className={styles.enterWrapper}>
            <div className={this.enterButtonClass}>
              {this.renderEnterbutton()}
            </div>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.wrapperInner}>
          {this.renderPrevQuestion()}
          {this.renderCurrentQuestion()}
          {this.renderNextQuestion()}
        </div>
        {this.renderNavButtons()}
      </div>
    );
  }

}

export default FormInteractiveView;
