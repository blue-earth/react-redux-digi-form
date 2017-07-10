import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Nav,
  NavItem,
  Tab
} from 'react-bootstrap';
import { identityConstants } from 'schemas/idVerificationFormSchema';
import IDVerificationTitle from '../IDVerificationTitle';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import PassportForm from 'containers/IDVerification/PassportFormContainer';
import DriversLicenseForm from 'containers/IDVerification/DriversLicenseFormContainer';
import MedicareCardForm from 'containers/IDVerification/MedicareCardFormContainer';
import UploaderForm from 'containers/IDVerification/UploaderFormContainer';
import styles from './IDVerificationForm.scss';

export default class IDVerificationForm extends Component {
  static propTypes = {
    // activeTab: PropTypes.oneOf([
    //   'online', 'upload'
    // ]),
    align: PropTypes.oneOf([
      'left', 'center', 'right'
    ]),
    submitIdentity: PropTypes.func.isRequired,
    requestUploadIdFile: PropTypes.func,
    doneUploadIdFile: PropTypes.func,
    idType: PropTypes.number.isRequired,
    setIdType: PropTypes.func.isRequired
  };

  static defaultProps = {
    align: 'left'
  };

  constructor(props) {
    super(props);
    this.state = {
      notice: 'We require additional information to verify your identification online'
    };
  }

  setNotice = (notice) => {
    this.setState({ notice });
  }

  renderVerifyOnline() {
    const { idType } = this.props;
    const props = _.pick(this.props, ['idType', 'setIdType', 'submitIdentity', 'isSubmitting']);

    switch (idType) {
      case identityConstants.DVSPASSPORT:
        return <PassportForm {...props} setNotice={this.setNotice} />;
      case identityConstants.DVSDRIVERLICENSE:
        return <DriversLicenseForm {...props} setNotice={this.setNotice} />;
      case identityConstants.DVSMEDICARECARD:
        return <MedicareCardForm {...props} setNotice={this.setNotice} />;
      default:
        return false;
    }
  }

  renderUploader() {
    const props = _.pick(this.props, [
      'submitIdentity', 'requestUploadIdFile', 'doneUploadIdFile', 'isSubmitting', 'isUploading'
    ]);
    return (
      <UploaderForm {...props} setNotice={this.setNotice} />
    );
  }

  render() {
    const { align } = this.props;
    const { notice } = this.state;

    return (
      <div className={styles.idVerificationForm}>
        <IDVerificationTitle align={align} notice={notice} />
        <Tab.Container id="IDVerificationFormTabs" defaultActiveKey="online">
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
