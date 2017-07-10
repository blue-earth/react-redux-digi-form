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
    requestUploadIdFile: PropTypes.func,
    doneUploadIdFile: PropTypes.func
  };

  static defaultProps = {
    requestUploadIdFile: () => {},
    doneUploadIdFile: () => {},
    setNotice: () => {}
  };

  handleUploadSuccess = (response) => {
    const { doneUploadIdFile, input: { value, onChange } } = this.props;
    doneUploadIdFile();
    const attachments = _.union(value, [response.id]);
    onChange(attachments);
  }

  handleUploadFail = (response) => {
    const { doneUploadIdFile, setNotice } = this.props;
    doneUploadIdFile();
    setNotice('Failed to upload the file. Please try again abit later.');
  }

  handleStart = (response) => {
    const { requestUploadIdFile } = this.props;
    requestUploadIdFile();
  }

  handleCancelFile = () => {
    const { doneUploadIdFile, input: { onChange } } = this.props;
    doneUploadIdFile();
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
