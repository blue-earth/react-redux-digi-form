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
    setNotice: PropTypes.func.isRequired,
    requestUploadIdFile: PropTypes.func,
    doneUploadIdFile: PropTypes.func,
    isSubmitting: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired
  };

  getUploadFields(values) {
    const body = {
      'type': identityConstants.MANUAL_FILE_UPLOAD,
      'person': {
        'id': 1
      },
      'attachment_ids': values.attachment_ids
    };
    return body;
  }

  handleSubmitForm = (values) => {
    const { submitIdentity, setNotice } = this.props;
    let body = {};
    body = this.getUploadFields(values);

    submitIdentity({
      body,
      success: (data) => {
        if (data['result']) {
          // The success here means the request succeed, does not refer to the verification succeed
          alert('Identity Verification Success!');
        } else {
          setNotice('Failed to verify your identity. Please verify against other type of document.');
        }
      },
      fail: () => {
        setNotice('Failed to verify your identity. Please verify against other type of document.');
      }
    });
  }

  render() {
    const { handleSubmit, setNotice, requestUploadIdFile, doneUploadIdFile, isSubmitting, isUploading } = this.props;
    console.log(this.props);
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
          <Field name="attachment_ids" component={UploaderField} setNotice={setNotice}
            requestUploadIdFile={requestUploadIdFile} doneUploadIdFile={doneUploadIdFile} />
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter submitting={isSubmitting || isUploading} />
      </Form>
    );
  }
}
