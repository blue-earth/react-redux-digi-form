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
        <IDVerificationForm setNotice={this.setNotice} onLinkClick={onLinkClick} person={person}
          defaultActiveTab={activeTab} />
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
