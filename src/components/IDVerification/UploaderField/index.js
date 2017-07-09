import React, { Component, PropTypes } from 'react';
import XHRUploader from 'components/XHRUploader';
import _ from 'lodash';
import { IDENTITY_ATTACHMENT_URL } from 'redux/modules/idVerificationForm';

export default class UploaderField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    // onChange: PropTypes.func.isRequired,
    // value: PropTypes.array,
    setNotice: PropTypes.func,
    requestSubmitIdentity: PropTypes.func,
    doneSubmitIdentity: PropTypes.func
  };

  static defaultProps = {
    requestSubmitIdentity: () => {},
    doneSubmitIdentity: () => {},
    setNotice: () => {}
  };

  handleUploadSuccess = (response) => {
    const { doneSubmitIdentity, input: { value, onChange } } = this.props;
    doneSubmitIdentity();
    const attachments = _.union(value, [response.id]);
    onChange(attachments);
  }

  handleUploadFail = (response) => {
    const { doneSubmitIdentity, setNotice } = this.props;
    doneSubmitIdentity();
    setNotice('Failed to upload the file. Please try again abit later.');
  }

  handleStart = (response) => {
    const { requestSubmitIdentity } = this.props;
    requestSubmitIdentity();
  }

  handleCancelFile = () => {
    const { doneSubmitIdentity, input: { onChange } } = this.props;
    doneSubmitIdentity();
    onChange([]);
  }

  render() {
    return (
      <XHRUploader
        url={IDENTITY_ATTACHMENT_URL}
        fieldName="file"
        method="POST"
        maxFiles={1}
        accept="image/*"
        onStart={this.handleStart}
        onCancel={this.handleCancelFile}
        onSuccess={this.handleUploadSuccess}
      />
    );
  }
}
