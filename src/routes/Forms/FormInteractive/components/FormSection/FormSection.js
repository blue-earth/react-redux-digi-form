import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { MdCheck, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md';
import QuestionInteractive from 'components/Questions/QuestionInteractive/QuestionInteractive';
import FormRow from '../FormRow/FormRow';
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection';
import { getContextFromAnswer, getFirstQuestionOfGroup, 
  SlideAnimation } from 'helpers/formInteractiveHelper';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormSection.scss';
import _ from 'lodash';
import Animate from 'rc-animate';

class FormSection extends Component {

  static propTypes = {
    primaryColor: PropTypes.string,

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
     * allQuestions: Array of all the questions from form response.
     */ 
    allQuestions: PropTypes.array.isRequired,

    /*
     * questionGroup: A structured group of questions for this form section(step)
     */ 
    questionGroup: PropTypes.object.isRequired,

    /*
     * logics: Array of Logic jumps, it is a part of form response.
     */ 
    logics: PropTypes.array,

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
    storeAnswer: PropTypes.func.isRequired
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
    const { questionGroup: {questions}, currentQuestionId, allQuestions, verificationStatus,
      primaryColor, answers, storeAnswer, nextQuestion, isVerifying } = this.props;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const context = getContextFromAnswer(answers);

    if (questions) {
      return questions.map((question, i) => {
        const idx = findIndexById(allQuestions, question.id);
        const answer = _.find(answers, {id: question.id});
        const answerValue = typeof answer === 'object' ? answer.value : '';
        return (
          <QuestionInteractive key={question.id}
            {...question} 
            primaryColor={primaryColor}
            verificationStatus={verificationStatus}
            storeAnswer={storeAnswer}
            nextQuestion={nextQuestion}
            context={context}
            value={answerValue}
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
    const { allQuestions, currentQuestionId, questionGroup } = this.props;
    const groupQuestions = questionGroup.questions;
    const currentQuestionIndex = findIndexById(allQuestions, currentQuestionId);
    const firstGroupIdx = findIndexById(allQuestions, groupQuestions[0].id);
    return (currentQuestionIndex == firstGroupIdx);
  }

  get renderActiveSection() {
    const { step, totalSteps, questionGroup, prevQuestion, nextQuestion, primaryColor } = this.props;
    const slideAnimation = new SlideAnimation;
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave,
    }

    return (
      <section className={`${styles.formSection} ${styles.active}`}>
        <hr className={styles.hrLine} />
        <FormRow>
          <div className={styles.step}>
            { `${step} of ${totalSteps}` }
          </div>

          <div className={styles.formSectionInner}>
            <Animate exclusive={false} animation={anim} component="div">
              <h3 className={styles.formSectionTitle} key={"formSectionTitle"}>
              { this.shouldShowActiveTitle() && questionGroup.title}
              </h3>
              {this.renderAllQuestions}
            </Animate>
          </div>

          <ul className={styles.navButtonsWrapper}>
            <li>
              <Button className={styles.navButton} onClick={() => prevQuestion()}>
                <MdKeyboardArrowUp size="24" />
              </Button>
            </li>
            <li>
              <Button className={styles.navButton} onClick={() => nextQuestion()}>
                <MdKeyboardArrowDown size="24" />
              </Button>
            </li>
          </ul>
        </FormRow>
        <hr className={styles.hrLine} />
        <FormRow>
          <LearnMoreSection primaryColor={primaryColor} />
        </FormRow>
        { step < totalSteps &&
          <FormRow>
            <h2 className={styles.nextSectionTitle}>Next Sections</h2>
          </FormRow>
        }
      </section>
    )
  }

  get renderPendingSection() {
    const { step, totalSteps, questionGroup } = this.props;
    return (
      <section className={`${styles.formSection} ${styles.pending}`}>
        <FormRow>
          <div className={styles.step}>
            { step }
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>{questionGroup.title}</h3>
          </div>
        </FormRow>
      </section>
    )
  }

  get renderCompletedSection() {
    const { step, totalSteps, questionGroup, goToQuestion } = this.props;
    const firstQuestionId = getFirstQuestionOfGroup(questionGroup);
    return (
      <section className={`${styles.formSection} ${styles.completed}`}>
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
      </section>
    )
  }

  render() {
    const { status } = this.props;
    if ( status === 'active' )
      return this.renderActiveSection;
    else if ( status === 'pending' )
      return this.renderPendingSection;
    else
      return this.renderCompletedSection;
  }

}

export default FormSection
