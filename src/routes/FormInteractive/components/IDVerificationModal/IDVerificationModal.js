import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
import IDVerificationForm from 'containers/IDVerification';
import PeopleList from 'containers/IDVerification/PeopleListContainer';
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
          {idVerifyStatus.step === 'VERIFY' &&
            <IDVerificationForm setNotice={this.setNotice} onLinkClick={onLinkClick} />}
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'idVerificationModal' })(IDVerificationModal);
