import React, {
  Component,
  PropTypes
} from 'react';
import { reduxForm, Field } from 'redux-form';
import { formSchemaNotifications } from './schema';
import TextInput from 'components/TextInput';
import QuestionRichTextEditor from 'components/QuestionEditFields/QuestionRichTextEditor';
import SelectBox from 'components/SelectBox';
import Button from 'components/Buttons/DashboardButtons/Button';
import styles from './Form.scss';
import classNames from 'classnames';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

const renderTextInput = field => (
  <div className={classNames([styles.builderItem])}>
    <TextInput {...field.input} type={field.type} label={field.label} labelStyle="major"
      autoFocus={field.autoFocus} prefix={field.prefix} helpText={field.helpText}
      hasError={field.meta.touched && field.meta.error} />
    {field.meta.touched && field.meta.error &&
      <div className={styles.error}>{field.meta.error}</div>
    }
  </div>
);

const renderRTE = field => (
  <div className={classNames([styles.builderItem])}>
    <QuestionRichTextEditor {...field.input} answersPullRight
      title={field.title} labelStyle="major"
      filteredQuestions={field.filteredQuestions} setValue={field.input.onChange} />
    {field.meta.touched && field.meta.error &&
      <div className={styles.error}>{field.meta.error}</div>
    }
  </div>
);

const renderSelectBox = field => (
  <div />
);

class NotificationsForm extends Component {

  static propTypes = {
    questions: PropTypes.array,
    handleSubmit: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool
  }

  render() {
    const { questions } = this.props;
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));
    return (
      <form>

        <div className={styles.builderDivider} />
        <p className={styles.formSubmit}>
          <Button style="formButton" onClick={this.props.handleSubmit}>Save &amp; Continue</Button>
        </p>
      </form>
    );
  }
}

export default reduxForm({
  form: 'builderConfigureNotifications',
  validate: formSchemaNotifications.validate
})(NotificationsForm);
