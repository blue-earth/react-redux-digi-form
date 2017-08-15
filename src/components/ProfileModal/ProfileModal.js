import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import styles from './ProfileModal.scss';
import XHRUploader from 'components/XHRUploader';
import TextInput from 'components/TextInput';

class ProfileModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func,
    show: PropTypes.bool,
    user: PropTypes.object.isRequired,
    updateUserProfile: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: false,
      fname: this.props.user.first_name,
      lname: this.props.user.last_name,
      avatar: ''
    };
  }

  handleUploadStart = () => {
    this.setState({ buttonDisabled: true });
  }

  handleUploadCancel = () => {
    this.setState({ buttonDisabled: false });
  }

  handleUploadSuccess = (response) => {
    this.setState({ buttonDisabled: false, avatar: response.avatar });
  }

  handleUpdateUser = () => {
    const { updateUserProfile, handleHide } = this.props;
    const { fname, lname } = this.state;
    var user = {first_name: fname, last_name: lname};
    updateUserProfile(user);
    handleHide();
  }

  handleChangeFirstName = (fNameValue) => {
    this.setState({fname: fNameValue});
  }
  handleChangeLastName = (lNameValue) => {
    this.setState({lname: lNameValue});
  }

  render() {
    const { show, handleHide } = this.props;
    const { buttonDisabled, avatar } = this.state;
    var requestURL = `${API_URL}/accounts/api/user/`;
    var method = 'PUT';
    return (
      <Modal show={show} onHide={handleHide}
        backdrop="static"
        className={styles.profileModal}
        dialogClassName={styles.profileModalDialog}
      >
        <Modal.Header className={styles.modalHeader} closeButton />
        <Modal.Body className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            Complete your profile
          </h3>
          <TextInput type="text" wrapperClass={styles.profileModalFName}
            placeholderText="First name" value={this.state.fname} onChange={this.handleChangeFirstName} />
          <TextInput type="text" wrapperClass={styles.profileModalLName}
            placeholderText="Last name" value={this.state.lname} onChange={this.handleChangeLastName} />
          {avatar
            ? <div className={styles.avatarWrapper} style={{backgroundImage: 'url('+avatar+')'}} />
            : <div>
              <div className={styles.uploaderWrapper}>
                <XHRUploader
                  url={requestURL}
                  fieldName="avatar"
                  dropzoneLabel=""
                  method={method}
                  maxFiles={1}
                  accept="image/jpeg,image/jpg,image/png,"
                  onStart={this.handleUploadStart}
                  onCancel={this.handleUploadCancel}
                  onSuccess={this.handleUploadSuccess}
                />
              </div>
              <div className={styles.uploaderText}>
                <p>Drop your image on the field to the left, or click to browse your computer.
                  <br />We recommend using a PNG or JPG image of at least 100 x 100 pixels.</p>
              </div>
            </div>
          }
          <Button block className={styles.profileSubmitButton} style="submitButton"
            isDisabled={buttonDisabled} onClick={this.handleUpdateUser}>
            Save &amp; continue
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ProfileModal;
