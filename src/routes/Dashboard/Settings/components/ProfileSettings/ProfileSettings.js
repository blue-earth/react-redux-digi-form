import React, {
  Component,
  PropTypes
} from 'react';
import { Field } from 'redux-form';
import styles from './ProfileSettings.scss';
import { Image } from 'react-bootstrap';
import SelectButton from 'components/Buttons/SelectButton';
import AppButton from 'components/Buttons/AppButton/AppButton';
import classNames from 'classnames';
import ChangePasswordModal from './ChangePasswordModal';
import Dropzone from 'react-dropzone';

class AvatarDropZoneFileInput extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  onDrop(files) {
    const { input } = this.props;
    input.onChange(files[0]);
  }

  render() {
    const dropZoneStyle = {
      width: '100%',
      height: '100%',
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5
    };
    return (
      <div className={styles.imageWrapper}>
        <Dropzone onDrop={this.onDrop} accept="image/*" maxSize={1024*1024} multiple={false} style={dropZoneStyle}>
        </Dropzone>
      </div>
    );
  };
}

class ProfileSettings extends Component {
  static propTypes = {
    show: PropTypes.func.isRequired,
    fetchProfileSettings: PropTypes.func.isRequired,
    requestSubmitProfileSettings: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    isPageBusy: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.activeDrag = 0;
    this.state = {
      avatar: props.data.avatar,
      isDragging: false
    };
  }
  componentDidMount() {
    this.props.fetchProfileSettings();
  }

  editPassword = () => {
    this.props.show('changePasswordModal');
  }

  selectImage = () => {
    this.refs.imageInput.click();
  }

  previewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.setState({
        avatar: e.target.result
      })
    }
  }

  imageSelected = (event) => {
    let files = event.target.files;
    let image = files.length ? files[0] : '';
    image && this.previewImage(image);
  }
  deleteAvatar = () => {
    this.refs.imageInput.value = '';
    this.setState({
      avatar: null
    });
  }

  handleDragEnter = (event) => {
    event.preventDefault();
    this.activeDrag += 1;
    this.setState({isDragging: this.activeDrag > 0});
  }
  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  handleDragLeave = (event) => {
    event.preventDefault();
    this.activeDrag -= 1;
    if (this.activeDrag === 0) {
      this.setState({isDragging: false});
    }
  }
  handleFileDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
    }
  } 

  renderAvatarSection() {
    return (
      <section>
        <h4 className={styles.sectionTitle}>Avatar</h4>
        <div className="clearfix"></div>
        <div className={styles.rowWrapper}>
          <div className="pull-left">
            <Field name="avatar" component={AvatarDropZoneFileInput} />
            <div className={styles.deleteWrapper}>
              <a href="javascript:;" className={styles.linkButton} onClick={this.deleteAvatar}>
                Delete
              </a>
            </div>
          </div>
          <div className={styles.instructionsSection}>
            <p className={styles.instructions}>
              Drop your file to the field on the left or &nbsp;
              <a href="javascript:;" className={styles.linkButton} onClick={this.selectImage}>
                browser your disk
              </a>
              &nbsp;for file. Upload at least 256 &times; 256px PNG or JPG.
            </p>
          </div>
        </div>
        <hr className={styles.hrLine} />
      </section>
    );
  }
  renderNameSection() {
    return (
      <div>
        <h4 className={styles.sectionTitle}>Name</h4>
        <div className="clearfix"></div>
        <Field name="firstName" component="input" placeholder="First name"
          type="text" className={styles.formInput} />
        <Field name="lastName" component="input" placeholder="Last name"
          type="text" className={classNames('pull-right', styles.formInput)} />
        <hr className={styles.hrLine} />
      </div>
    );
  }
  renderCredentialsSection() {
    return (
      <section>
        <h4 className={styles.sectionTitle}>Credentials (admin)</h4>
        <a href="javascript:;"
          className={classNames(styles.linkButton, 'pull-right')}
          onClick={this.editPassword}>
          Change password
        </a>
        <div className="clearfix"></div>
        <Field name="email" component="input" type="text" disabled className={styles.formInput} />
        <p className={styles.instructions}>
          <i>Added on {'1st July 2016'}. You appear as <strong>{'Jordan from emondo'}</strong>.</i>
        </p>
        <hr className={styles.hrLine} />
      </section>
    );
  }
  renderTimezoneSection() {
    const optionsList = [{
      key: '+1000',
      label: '(UTC+10:00) Sydney'
    }, {
      key: '+800',
      label: '(UTC+08:00) Perth'
    }
    ];
    const renderSelectField = ({ input, optionsList, ...custom }) => {
      const handleChange = (event, index, value) => input.onChange(value);
      return (
        <SelectButton
          {...input}
          {...custom}
          onChange={handleChange} value="(UTC+10:00) Sydney" />
      );
    };
    return (
      <section>
        <h4 className={styles.sectionTitle}>Timezone</h4>
        <div className="clearfix"></div>
        <Field
          name="timezone"
          component={renderSelectField}
          optionList={optionsList}
          className={styles.timezoneSelection} />
        <hr className={styles.hrLine} />
      </section>
    );
  }
  submitForm = () => {
    // e.preventDefault();
    this.props.requestSubmitProfileSettings();
  };

  render() {
    const { isPageBusy } = this.props;
    return (
      <form onSubmit={this.submitForm} className={styles.profileSettingForm}>
        {this.renderAvatarSection()}
        {this.renderNameSection()}
        {this.renderCredentialsSection()}
        {this.renderTimezoneSection()}
        <AppButton disabled={isPageBusy} primaryColour="#ff8a00" onClick={this.submitForm}>Save</AppButton>
        <ChangePasswordModal />
      </form>
    );
  }
}

export default ProfileSettings;
