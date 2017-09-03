import React, {
  Component,
  PropTypes
} from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { formSchemaNotifications } from './schema';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextInput/TextArea';
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

const renderTextArea = field => (
  <div className={cx('builderItem')}>
    <TextArea {...field.input} label={field.label} labelStyle={field.labelStyle}
      autoFocus={field.autoFocus} helpText={field.helpText}
      hasError={field.meta.touched && field.meta.error} />
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

class renderRecipients extends Component {
  static propTypes = {
    fields: PropTypes.object,
    meta: PropTypes.object,
    emailQuestions: PropTypes.array
  }

  componentDidMount() {
    if (this.props.fields.length < 1) {
      this.props.fields.push({type: 'question_prefill'});
    }
  }

  render() {
    const { fields, emailQuestions } = this.props;
    return (<div>
      {fields.map((recipient, index) =>
        <div key={index}>
          <Field name={`${recipient}.data`}
            component={renderSelectBox}
            optionsList={emailQuestions}
            label="Send email notifications to:"
            labelPosition="above"
            placeholder="Choose email question"
            fullWidth />
        </div>
      )}
    </div>);
  }
}

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
    const emailQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'EmailField'));
    return (
      <form>
        <FieldArray name="formConfig.externalNotifications.recipients"
          component={renderRecipients}
          emailQuestions={emailQuestions} />
        <Field name={'formConfig.externalNotifications.sender'}
          component={renderTextInput}
          label="Send email notifications from:"
          labelStyle="minor" />
        <Field name={'formConfig.externalNotifications.signature'}
          component={renderTextArea}
          label="Email signature"
          labelStyle="minor" />
        <Field name={'formConfig.externalNotifications.disclaimer'}
          component={renderTextArea}
          label="Email disclaimer"
          labelStyle="minor" />
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
