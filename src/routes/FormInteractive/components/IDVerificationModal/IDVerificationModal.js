import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import _ from 'lodash';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
import IDVerificationForm from 'containers/IDVerification';
import IDVerificationFormWrapper from 'components/IDVerification/IDVerificationFormWrapper';
import PeopleList from 'containers/IDVerification/PeopleListContainer';
import SelectMethod from 'components/IDVerification/SelectMethod';
import styles from './IDVerificationModal.scss';

class IDVerificationModal extends Component {

  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    formConfig: PropTypes.object,
    idVerifyStatus: PropTypes.object.isRequired,
    setIDVerifyStatus: PropTypes.func.isRequired,
    onLinkClick: PropTypes.func.isRequired
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

  postVerify() {
    const { idVerifyStatus: { index, people }, onLinkClick, setIDVerifyStatus } = this.props;
    people[index].status = 'VERIFIED';
    const newIndex = _.findIndex(people, { status: 'PENDING' });
    if (newIndex >= 0) { // we still have pending verification
      setIDVerifyStatus({
        step: 'SELECT_METHOD',
        people,
        index: newIndex
      });
    } else { // all done, go to completed page
      onLinkClick();
    }
  }

  handleSuccess = (data) => {
    if (data['result']) {
      // The success here means the request succeed, does not refer to the verification succeed
      this.setNotice('Identity Verification Success!');
      this.postVerify();
    } else {
      this.setNotice('Failed to verify your identity. Please verify against other type of document.');
    }
  }

  handleFail = (data) => {
    this.setNotice('Failed to verify your identity. Please verify against other type of document.');
  }

  renderForm() {
    const { idVerifyStatus: { index, people, activeTab }, onLinkClick } = this.props;
    const person = _.defaultTo(people[index], {});
    return (
      <div>
        <div className={styles.personName}>
          <IDVerificationFormWrapper>
          {`${person.first_name} ${person.last_name}`}
          </IDVerificationFormWrapper>
        </div>
        <IDVerificationForm defaultActiveTab={activeTab} person={person}
          onLinkClick={onLinkClick} onSuccess={this.handleSuccess} onFail={this.handleFail} />
      </div>
    );
  }

  render() {
    const { show, handleHide, idVerifyStatus, setIDVerifyStatus, onLinkClick } = this.props;
    const { notice } = this.state;
    return (
      <Modal show={show} backdrop="static" onHide={handleHide} dialogClassName={styles.idVerificationModal}>
        <Modal.Header className={styles.modalHeader}>
          <IDVerificationTitle align="left" notice={notice} />
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {idVerifyStatus.step === 'SELECT_PEOPLE' &&
            <PeopleList people={idVerifyStatus.people} setIDVerifyStatus={setIDVerifyStatus}
              onLinkClick={onLinkClick} />
          }
          {idVerifyStatus.step === 'SELECT_METHOD' &&
            <SelectMethod idVerifyStatus={idVerifyStatus} setIDVerifyStatus={setIDVerifyStatus}
              onLinkClick={onLinkClick} />
          }
          {idVerifyStatus.step === 'VERIFY' && this.renderForm()}
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'idVerificationModal' })(IDVerificationModal);
