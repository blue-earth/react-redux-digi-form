import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Col,
  OverlayTrigger,
  Popover,
  Row
} from 'react-bootstrap';
import {
  MdCloudUpload,
  MdHelp
} from 'react-icons/lib/md';
import AppButton from 'components/Buttons/AppButton';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import StatusLabel from '../StatusLabel';
import styles from './SelectMethod.scss';

export default class SelectMethod extends Component {
  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    onLinkClick: PropTypes.func.isRequired,
    idVerifyStatus: PropTypes.object.isRequired,
    setIDVerifyStatus: PropTypes.func.isRequired
  };

  handleContinueClick = (values) => {
    const { idVerifyStatus: { index }, setIDVerifyStatus } = this.props;
    setIDVerifyStatus({
      step: 'VERIFY',
      index,
      activeTab: 'online'
    });
  }

  handleUploadClick = (index) => {
    const { setIDVerifyStatus } = this.props;
    setIDVerifyStatus({
      step: 'VERIFY',
      index,
      activeTab: 'upload'
    });
  }

  handleSendEmailClick = (index) => {
    // TODO: implement handleSendEmailClick
  }

  handleVerifyOnlineClick = (index) => {
    const { setIDVerifyStatus } = this.props;
    setIDVerifyStatus({
      step: 'VERIFY',
      index,
      activeTab: 'online'
    });
  }

  get tooltipUpload() {
    return (
      <Popover id="tooltipUploadVerification">
        TODO: Add tooltip for Upload verification
      </Popover>
    );
  }

  get tooltipVerifyOnline() {
    return (
      <Popover id="tooltipVerifyOnline">
        TODO: Add tooltip for Online Verifification
      </Popover>
    );
  }

  get tooltipSendEmail() {
    return (
      <Popover id="tooltipSendEmail">
        TODO: Add tooltip for Sending email
      </Popover>
    );
  }

  renderPersonalInfo(person) {
    return (
      <div className={styles.personalInfo}>
        <Row>
          <Col xs={4}>
            <dt className={styles.fieldLabel}>
              First name
            </dt>
            <dd className={styles.fieldValue}>
              {person.first_name}
            </dd>
          </Col>
          <Col xs={4}>
            <dt className={styles.fieldLabel}>
              Last name
            </dt>
            <dd className={styles.fieldValue}>
              {person.last_name}
            </dd>
          </Col>
          <Col xs={4}>
            <dt className={styles.fieldLabel}>
              Status
            </dt>
            <dd className={styles.fieldValue}>
              <StatusLabel status={person.status} />
            </dd>
          </Col>
        </Row>
      </div>
    );
  }

  renderMethods(person, index) {
    const { primaryColour } = this.context;
    const that = this;
    const rightButtonClickHandler = person.selected
      ? function () { that.handleVerifyOnlineClick(index); }
      : function () { that.handleSendEmailClick(index); };
    const tooltopRightButton = person.selected
      ? this.tooltipSendEmail
      : this.tooltipVerifyOnline;
    const rightButtonLabel = person.selected ? 'Send email' : 'Verify online';

    return (
      <div className={styles.methodsWrapper}>
        <div className={styles.methodLabel}>
          Choose one ID method
        </div>
        <div className={styles.methods}>
          <OverlayTrigger trigger={['focus', 'hover']} placement="right" overlay={this.tooltipUpload}>
            <a href="javascript:;" className={styles.tooltipText}>
              <MdHelp size={16} />
            </a>
          </OverlayTrigger>
          <AppButton type="secondary" onClick={function () { that.handleUploadClick(index); }}>
            <span style={{color: primaryColour}}><MdCloudUpload /> Upload</span>
          </AppButton>
          <span className={styles.textOR}>or</span>
          <AppButton primaryColour={primaryColour} onClick={rightButtonClickHandler}>
            {rightButtonLabel}
          </AppButton>
          <OverlayTrigger trigger={['focus', 'hover']} placement="right" overlay={tooltopRightButton}>
            <a href="javascript:;" className={styles.tooltipText}>
              <MdHelp size={16} />
            </a>
          </OverlayTrigger>
        </div>
      </div>
    );
  }

  render() {
    const { onLinkClick, idVerifyStatus: { people } } = this.props;
    return (
      <div className={styles.selectMethodWrapper}>
        <IDVerificationFormWrapper>
          <div className={styles.peopleWrapper}>
            {
              _.map(people, (person, index) => (
                <div className={styles.personItem}>
                  {this.renderPersonalInfo(person)}
                  {this.renderMethods(person, index)}
                </div>
              ))
            }
          </div>
        </IDVerificationFormWrapper>
        <div className={styles.footerWrapper}>
          <IDVerificationFormFooter includeTerms={false} submitLabel="Continue"
            onLinkClick={onLinkClick} onButtonClick={this.handleContinueClick} />
        </div>
      </div>
    );
  }
}
