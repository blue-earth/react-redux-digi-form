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
import classNames from 'classnames/bind';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

const cx = classNames.bind(styles);

const renderTextInput = field => (
  <div className={cx('builderItem')}>
    <TextInput {...field.input} type={field.type} label={field.label} labelStyle={field.labelStyle}
      autoFocus={field.autoFocus} prefix={field.prefix} helpText={field.helpText}
      hasError={field.meta.touched && field.meta.error} />
    {field.meta.touched && field.meta.error &&
      <div className={cx('error')}>{field.meta.error}</div>
    }
  </div>
);

const renderRTE = field => (
  <div className={cx('builderItem')}>
    <QuestionRichTextEditor {...field.input} answersPullRight
      title={field.title} labelStyle={field.labelStyle}
      filteredQuestions={field.filteredQuestions} setValue={field.input.onChange} />
    {field.meta.touched && field.meta.error &&
      <div className={cx('error')}>{field.meta.error}</div>
    }
  </div>
);

export const renderSelectBox = field => (
  <div className={cx('builderItem')}>
    <SelectBox {...field.input}
      optionsList={field.optionsList}
      placeholder={field.placeholder}
      label={field.label} labelPosition={field.labelPosition}
      appearance={field.appearance}
      fullWidth={field.fullWidth}
      hasError={field.meta.touched && field.meta.error} />
    {field.meta.touched && field.meta.error &&
      <div className={cx('error')}>{field.meta.error}</div>
    }
  </div>
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
        <Field name={'formConfig.notifications.recipient'}
          component={renderSelectBox}
          optionsList={getQuestionsByType(filteredQuestions, 'EmailField')}
          label="Send email notifications to:"
          labelPosition="above"
          placeholder="Choose email question"
          fullWidth />
        <Field name={'formConfig.notifications.sender'}
          component={renderTextInput}
          label="Send email notifications from:"
          labelStyle="minor" />
        <Field name="formConfig.notifications.signature" component={renderRTE}
          title="Email signature"
          labelStyle="minor"
          filteredQuestions={filteredQuestions} />
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
