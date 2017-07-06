import React, { Component, PropTypes } from 'react';
import FormHeader from 'components/Headers/FormHeader';
import IDVerificationForm from 'containers/IDVerificationFormContainer';
import styles from './IdentityVerificationView.scss';

export default class IdentityVerificationView extends Component {
  static propTypes = {
    fetchForm: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { fetchForm, params: { formId } } = this.props;
    fetchForm(formId);
  }

  render() {
    const { form } = this.props;
    const title = form ? form.title : 'test title';
    return (
      <div className={styles.identityVerification}>
        <FormHeader title={title} submitAnswer={function () {}} />
        <div className={styles.content}>
          <IDVerificationForm align="center" />
        </div>
      </div>
    );
  }
}
