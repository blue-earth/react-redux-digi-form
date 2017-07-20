import React, {
  Component,
  PropTypes
} from 'react';
import QuestionPreview from 'components/Questions/QuestionPreview/QuestionPreview';
import FlowLine from 'components/Forms/FlowLine/FlowLine';
import StepIndicator from 'components/Forms/StepIndicator/StepIndicator';
import { getContextFromAnswer } from 'helpers/formInteractiveHelper';
import { findItemById } from 'helpers/pureFunctions';
import styles from './FormPreviewSection.scss';

class FormSection extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
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
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired
  };

  static defaultProps = {
    step: 1,
    totalSteps: 1,
    questionGroup: {
      title: 'Basic Details',
      questions: []
    }
  };

  get renderAllQuestions() {
    const { questionGroup: {questions}, answers } = this.props;
    const context = getContextFromAnswer(answers);

    if (questions) {
      return questions.map((question, i) => {
        const answer = findItemById(answers, question.id);
        var optionals = {};
        if (typeof answer === 'object') {
          optionals['value'] = answer.value;
        }
        return (
          <QuestionPreview key={question.id}
            {...question}
            context={context}
            {...optionals}
          />
        );
      });
    } else {
      return false;
    }
  }

  render() {
    const {
      step,
      totalSteps,
      questionGroup
    } = this.props;

    return (
      <section className={styles.formPreviewSection}>
        <FlowLine forPreview />
        <StepIndicator step={step} totalSteps={totalSteps} status="preview" />
        <div className={styles.formSectionInner}>
          <h3 className={styles.formSectionTitle}>
            {questionGroup.title}
          </h3>
          {this.renderAllQuestions}
        </div>
      </section>
    );
  }

}

export default FormSection;
