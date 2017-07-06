import React, { Component, PropTypes } from 'react';
import XHRUploader from 'components/XHRUploader';
import _ from 'lodash';
import { IDENTITY_ATTACHMENT_URL } from 'redux/modules/idVerificationForm';

export default class UploaderField extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array
  };

  handleUploadSuccess = (response) => {
    const { value, onChange } = this.props;
    const attachments = _.union(value, [response.id]);
    onChange(attachments);
  }

  handleUploadFail = (response) => {

  }

  handleCancelFile = () => {

  }

  render() {
    return (
      <div>
        <XHRUploader
          url={IDENTITY_ATTACHMENT_URL}
          fieldName="file"
          method="POST"
          maxFiles={1}
          accept="image/*"
          onStart={this.handleUploadFail}
          onCancel={this.handleCancelFile}
          onSuccess={this.handleUploadSuccess}
        />
      </div>
    );
  }
}
