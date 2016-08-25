import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Collapse
} from 'react-bootstrap';
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from 'react-icons/lib/md';
import QuestionInteractive from 'components/Questions/QuestionInteractive';
import FormRow from 'components/Forms/FormRow/FormRow';
import StepIndicator from 'components/Forms/StepIndicator';
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection';
import {
  getContextFromAnswer,
  getFirstQuestionOfGroup,
  shouldDisableNextButton,
  shouldDisablePrevButton
} from 'helpers/formInteractiveHelper';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormSection.scss';
import _ from 'lodash';

class FormSection extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    /*
     * status: Status of current section. 'active' is current section,
     *         'completed' is all-answered section and 'pending' is to-be-answered section.
     */
    status: PropTypes.oneOf(['pending', 'active', 'completed']),

    /*
     * step: current step number of the section, ex. in 2 of 5, 2 is step.
     */
    step: PropTypes.number,

    /*
     * totalSteps: Calculated number of sections(steps), ex. in 1 of 5, 5 is totalSteps.
     */
    totalSteps: PropTypes.number,

    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object.isRequired,

    /*
     * questionGroup: A structured group of questions for this form section(step)
     */
    questionGroup: PropTypes.object.isRequired,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array,

    /*
     * isVerifying: Redux state that indicates the status whether verification is in prgress with backend
     */
    isVerifying: PropTypes.bool.isRequired,

    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,

    /*
     * prefills: Redux state that stores the array of answer prefills values
     */
    prefills: PropTypes.array.isRequired,

    /*
     * prevQuestion: Redux action to move to previous question.
     */
    prevQuestion: PropTypes.func.isRequired,

    /*
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func.isRequired,

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
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired
  };

  static defaultProps = {
    status: 'pending',
    step: 1,
    totalSteps: 1,
    questionGroup: {
      title: 'Basic Details',
      questions: []
    }
  };

  get renderAllQuestions() {
    const { questionGroup: {questions}, currentQuestionId, form, verificationStatus,
      answers, prefills, storeAnswer, nextQuestion, handleEnter, isVerifying, show } = this.props;
    const allQuestions = form.questions;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const context = getContextFromAnswer(answers);

    if (questions) {
      return questions.map((question, i) => {
        const idx = findIndexById(allQuestions, question.id);
        const answer = _.find(answers, {id: question.id});
        var optionals = {};
        if (typeof answer === 'object') {
          optionals['value'] = answer.value;
        } else {
          const prefill = _.find(prefills, {id: question.id});
          if (typeof prefill === 'object') optionals['value'] = prefill.value;
        }
        return (
          <QuestionInteractive key={question.id}
            {...question}
            verificationStatus={verificationStatus}
            storeAnswer={storeAnswer}
            nextQuestion={nextQuestion}
            handleEnter={handleEnter}
            context={context}
            isVerifying={isVerifying}
            show={show}
            status={currentQuestionIndex === idx
              ? 'current' : currentQuestionIndex - idx === 1
              ? 'next' : idx - currentQuestionIndex === 1
              ? 'prev' : 'hidden'}
            {...optionals}
          />
        );
      });
    } else {
      return false;
    }
  }

  shouldShowActiveTitle() {
    const { form, currentQuestionId, questionGroup } = this.props;
    const allQuestions = form.questions;
    const groupQuestions = questionGroup.questions;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const firstGroupIdx = findIndexById(allQuestions, groupQuestions[0].id);
    return (currentQuestionIndex === firstGroupIdx);
  }

  renderNavButtons() {
    const { form, currentQuestionId, questionGroup, isVerifying, prevQuestion, nextQuestion } = this.props;
    const groupQuestions = questionGroup.questions;
    const questionNumber = findIndexById(groupQuestions, currentQuestionId) + 1;

    return (
      <div>
        <FormRow>
          <ul className={styles.navButtonsWrapper}>
            <li className={styles.activeQuestionNumber}>
              {questionNumber} / {groupQuestions.length}
            </li>
            <li>
              <Button className={styles.navButton} onClick={function () { prevQuestion(); }}
                disabled={shouldDisablePrevButton(form, currentQuestionId) || isVerifying}>
                <MdKeyboardArrowUp size="24" />
              </Button>
            </li>
            <li>
              <Button className={styles.navButton} onClick={function () { nextQuestion(); }}
                disabled={shouldDisableNextButton(form, currentQuestionId) || isVerifying}>
                <MdKeyboardArrowDown size="24" />
              </Button>
            </li>
          </ul>
        </FormRow>
      </div>
    );
  }

  render() {
    const { step, status, totalSteps, questionGroup, goToQuestion } = this.props;
    const firstQuestionId = getFirstQuestionOfGroup(questionGroup);

    const linkColor = {
      color: this.context.primaryColor
    };

    return (
      <section className={`${styles.formSection} ${styles[status]}`}>

        <Collapse in={status === 'active'} timeout={1000}>
          <div>
            {step > 1 && <hr className={styles.hrLine} />}
            <FormRow>
              <StepIndicator step={step} totalSteps={totalSteps} status={status} />
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>
                {this.shouldShowActiveTitle() && questionGroup.title}
                </h3>
                {this.renderAllQuestions}
              </div>
            </FormRow>
          </div>
        </Collapse>

        <Collapse in={status === 'pending'} timeout={1000}>
          <div>
            <FormRow>
              <StepIndicator step={step} totalSteps={totalSteps} status={status} />
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>{questionGroup.title}</h3>
              </div>
            </FormRow>
          </div>
        </Collapse>

        <Collapse in={status === 'completed'} timeout={1000}>
          <div>
            <FormRow>
              <StepIndicator step={step} totalSteps={totalSteps} status={status} />
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>
                  {questionGroup.title}
                  <a href="javascript:;" onClick={function () { goToQuestion(firstQuestionId); }}
                    className={styles.formSectionEdit} style={linkColor}>Edit</a>
                </h3>
              </div>
            </FormRow>
          </div>
        </Collapse>

        {status === 'active' && this.renderNavButtons()}
        {status === 'active' &&
          <div>
            <hr className={styles.hrLine} />
            <FormRow>
              <LearnMoreSection isLastSection={step === totalSteps} />
            </FormRow>
            {step < totalSteps &&
              <FormRow>
                <h2 className={styles.nextSectionTitle}>Next Sections</h2>
              </FormRow>
            }
          </div>
        }
      </section>
    );
  }

}

export default FormSection;
