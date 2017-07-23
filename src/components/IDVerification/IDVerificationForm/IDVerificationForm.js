import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Nav,
  NavItem,
  Tab
} from 'react-bootstrap';
import { identityConstants } from 'schemas/idVerificationFormSchema';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import PassportForm from 'containers/IDVerification/PassportFormContainer';
import DriversLicenseForm from 'containers/IDVerification/DriversLicenseFormContainer';
import MedicareCardForm from 'containers/IDVerification/MedicareCardFormContainer';
import UploaderForm from 'containers/IDVerification/UploaderFormContainer';
import styles from './IDVerificationForm.scss';

export default class IDVerificationForm extends Component {
  static propTypes = {
    defaultActiveTab: PropTypes.oneOf([
      'online', 'upload'
    ]),
    submitIdentity: PropTypes.func.isRequired,
    requestUploadIdFile: PropTypes.func,
    doneUploadIdFile: PropTypes.func,
    idType: PropTypes.number.isRequired,
    setIdType: PropTypes.func.isRequired,
    person: PropTypes.object,
    onLinkClick: PropTypes.func,
    onSuccess: PropTypes.func.isRequired,
    onFail: PropTypes.func.isRequired
  };

  static defaultProps = {
    defaultActiveTab: 'online',
    onSuccess: () => {},
    onFail: () => {}
  };

  renderVerifyOnline() {
    const { idType } = this.props;
    const props = _.pick(this.props, [
      'idType', 'setIdType', 'submitIdentity', 'isSubmitting', 'person', 'onLinkClick', 'onSuccess', 'onFail'
    ]);

    switch (idType) {
      case identityConstants.DVSPASSPORT:
        return <PassportForm {...props} />;
      case identityConstants.DVSDRIVERLICENSE:
        return <DriversLicenseForm {...props} />;
      case identityConstants.DVSMEDICARECARD:
        return <MedicareCardForm {...props} />;
      default:
        return false;
    }
  }

  renderUploader() {
    const props = _.pick(this.props, [
      'submitIdentity', 'requestUploadIdFile', 'doneUploadIdFile', 'isSubmitting',
      'isUploading', 'person', 'onLinkClick', 'onSuccess', 'onFail'
    ]);
    return (
      <UploaderForm {...props} />
    );
  }

  render() {
    const { defaultActiveTab } = this.props;
    return (
      <div className={styles.idVerificationForm}>
        <Tab.Container id="IDVerificationFormTabs" defaultActiveKey={defaultActiveTab}>
          <div className={styles.tabs}>
            <div className={styles.navsWrapper}>
              <IDVerificationFormWrapper>
                <Nav bsStyle="tabs" bsClass="idVerification">
                  <NavItem eventKey="online">
                    Verify online
                  </NavItem>
                  <NavItem eventKey="upload">
                    Upload ID
                  </NavItem>
                </Nav>
              </IDVerificationFormWrapper>
            </div>
            <Tab.Content animation className={styles.tabContent}>
              <Tab.Pane eventKey="online">
                {this.renderVerifyOnline()}
              </Tab.Pane>
              <Tab.Pane eventKey="upload">
                {this.renderUploader()}
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    );
  }
}
