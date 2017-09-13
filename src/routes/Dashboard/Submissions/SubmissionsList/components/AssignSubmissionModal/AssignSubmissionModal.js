import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import { connectModal } from 'redux-modal';
import styles from './AssignSubmissionModal.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class AssignSubmissionModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    handleHide: PropTypes.func,
    idList: PropTypes.array.isRequired,
    companyUsers: PropTypes.array,
    setAssignee: PropTypes.func.isRequired
  };

  handleAssign = (uid) => {
    this.props.setAssignee(this.props.idList, uid);
  }

  handleCloseModal = () => {
    this.props.handleHide();
  }

  render() {
    const { companyUsers } = this.props;
    const that = this;
    return (
      <Modal backdrop="static" show={this.props.show}
        className={styles.submissionsModal} dialogClassName={styles.modalWrapper}>
        <h3 className={cx('modalHeader')}>Assign Form Submission</h3>
        <Modal.Body bsClass={styles.submissionsModalWrapper}>
          <div>
            {companyUsers.map((user, index) => {
              return (
                <p className={cx('user')} key={index}>
                  <span className={cx('username')}>
                    {`${user.first_name} ${user.last_name}`}
                  </span>
                  <AppButton size="sm" onClick={function () { that.handleAssign(user.id); }}>
                    Assign
                  </AppButton>
                </p>
              );
            })}
          </div>
          <p><a onClick={this.handleCloseModal} className={cx('cancelButton')}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'assignSubmissionModal' })(AssignSubmissionModal);
