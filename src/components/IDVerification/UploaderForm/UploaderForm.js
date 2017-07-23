import React, { Component, PropTypes } from 'react';
// import _ from 'lodash';
import { Form } from 'react-bootstrap';
import { Field } from 'redux-form';
import { identityConstants } from 'schemas/idVerificationFormSchema';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import UploaderField from '../UploaderField';
import styles from './UploaderForm.scss';

export default class UploaderForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitIdentity: PropTypes.func.isRequired,
    requestUploadIdFile: PropTypes.func,
    doneUploadIdFile: PropTypes.func,
    isSubmitting: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
    person: PropTypes.object,
    onLinkClick: PropTypes.func,
    onSuccess: PropTypes.func.isRequired,
    onFail: PropTypes.func.isRequired
  };

  getUploadFields(values) {
    const { person } = this.props;
    const body = {
      'type': identityConstants.MANUAL_FILE_UPLOAD,
      'person': {
        'id': person && person.id
      },
      'attachment_ids': values.attachment_ids
    };
    return body;
  }

  handleSubmitForm = (values) => {
    const { submitIdentity, onSuccess, onFail } = this.props;
    let body = {};
    body = this.getUploadFields(values);

    submitIdentity({
      body,
      success: onSuccess,
      fail: onFail
    });
  }

  render() {
    const { handleSubmit, onFail, requestUploadIdFile, doneUploadIdFile, isSubmitting,
      onLinkClick, isUploading } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <IDVerificationFormWrapper>
          <div className={styles.uploadDescription}>
            <p>
              Please make sure all identification is a <em>certified copy</em>.<br />
              You can also send identification to accounts@cmc.com{' '}
              or mail to: PO Box 165, Sydney NSW, Australia 2000
            </p>
            <p>
              Documents to upload:<br />
              <em>Driver’s licence</em> OR <em>Australian Passport</em>
            </p>
          </div>
          <Field name="attachment_ids" component={UploaderField} onUploadFail={onFail}
            requestUploadIdFile={requestUploadIdFile} doneUploadIdFile={doneUploadIdFile} />
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter submitting={isSubmitting || isUploading} onLinkClick={onLinkClick} />
      </Form>
    );
  }
}
