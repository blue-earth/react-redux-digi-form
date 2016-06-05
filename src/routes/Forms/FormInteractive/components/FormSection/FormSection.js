import React, { Component, PropTypes } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { MdCheck, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md';
import QuestionInteractive from 'components/Questions/QuestionInteractive/QuestionInteractive';
import FormRow from '../FormRow/FormRow';
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection';
import { getContextFromAnswer, getFirstQuestionOfGroup, SlideAnimation, 
  shouldDisableNextButton, shouldDisablePrevButton } from 'helpers/formInteractiveHelper';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormSection.scss';
import _ from 'lodash';
import Animate from 'rc-animate';

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
    step: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /*
     * totalSteps: Calculated number of sections(steps), ex. in 1 of 5, 5 is totalSteps.
     */ 
    totalSteps: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

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
    handleEnter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
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
      answers, prefills, storeAnswer, nextQuestion, handleEnter, isVerifying } = this.props;
    const allQuestions = form.questions;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const context = getContextFromAnswer(answers);

    if (questions) {
      return questions.map((question, i) => {
        const idx = findIndexById(allQuestions, question.id);
        var value = '';
        const answer = _.find(answers, {id: question.id});
        if (typeof answer === 'object') {
          value = answer.value;
        } else {
          const prefill = _.find(prefills, {id: question.id});
          if (typeof prefill === 'object') value = prefill.value;
        }
        return (
          <QuestionInteractive key={question.id}
            {...question}
            verificationStatus={verificationStatus}
            storeAnswer={storeAnswer}
            nextQuestion={nextQuestion}
            handleEnter={handleEnter}
            context={context}
            value={value}
            isVerifying={isVerifying}
            status={currentQuestionIndex == idx 
              ? 'current' : currentQuestionIndex - idx == 1 
              ? 'next' : idx - currentQuestionIndex == 1
              ? 'prev' : 'hidden'} 
          />
        );
      });
    } else {
      return false;
    }
  }

  shouldShowActiveTitle() {
    const { form, currentQuestionId, questionGroup, goToQuestion } = this.props;
    const allQuestions = form.questions;
    const groupQuestions = questionGroup.questions;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const firstGroupIdx = findIndexById(allQuestions, groupQuestions[0].id);
    return (currentQuestionIndex == firstGroupIdx);
  }

  render() {
    const { step, status, totalSteps, questionGroup, prevQuestion, nextQuestion,
      currentQuestionId, form } = this.props;

    const slideAnimation = new SlideAnimation;
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave,
    }

    return (
      <section className={`${styles.formSection} ${styles[status]}`}>
        
        <Collapse in={status === 'active'} timeout={5000}>
          <div>
            {step > 1 && <hr className={styles.hrLine} />}
            <FormRow>
              <div className={styles.step}>
                { `${step} of ${totalSteps}` }
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle} key={"formSectionTitle"}>
                { this.shouldShowActiveTitle() && questionGroup.title}
                </h3>
                {this.renderAllQuestions}
              </div>
            </FormRow>
          </div>
        </Collapse>

        <Collapse in={status === 'pending'} timeout={5000}>
          <div>
            <FormRow>
              <div className={styles.step}>
                { step }
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>{questionGroup.title}</h3>
              </div>
            </FormRow>
          </div>
        </Collapse>

        <Collapse in={status === 'completed'} timeout={5000}>
          <div>
            <FormRow>
              <div className={styles.step}>
                <a href="javascript:;"><MdCheck className={styles.greenIcon} /></a>
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>
                  {questionGroup.title}
                  <a href="javascript:;" onClick={() => goToQuestion(firstQuestionId)} 
                    className={styles.formSectionEdit}>Edit</a>
                </h3>
              </div>
            </FormRow>
          </div>
        </Collapse>

        {status === 'active' &&
          <div>
            <FormRow>
              <ul className={styles.navButtonsWrapper}>
                <li>
                  <Button className={styles.navButton} onClick={() => prevQuestion()}
                    disabled={shouldDisablePrevButton(form, currentQuestionId)}>
                    <MdKeyboardArrowUp size="24" />
                  </Button>
                </li>
                <li>
                  <Button className={styles.navButton} onClick={() => nextQuestion()}
                    disabled={shouldDisableNextButton(form, currentQuestionId)}>
                    <MdKeyboardArrowDown size="24" />
                  </Button>
                </li>
              </ul>
            </FormRow>
            <hr className={styles.hrLine} />
            <FormRow>
              <LearnMoreSection />
            </FormRow>
            { step < totalSteps &&
              <FormRow>
                <h2 className={styles.nextSectionTitle}>Next Sections</h2>
              </FormRow>
            }
          </div>
        }
      </section>
    )
  }

}

export default FormSection
