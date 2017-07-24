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
    this.state = {
      avatar: props.data.avatar
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
  imageSelected = (event) => {
    let files = event.target.files;
    let image = files.length ? files[0] : '';
    let reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.setState({
          avatar: e.target.result
        });
      };
    }
  }
  deleteAvatar = () => {
    this.refs.imageInput.value = '';
    this.setState({
      avatar: null
    });
  }

  renderAvatarSection() {
    return (
      <section>
        <h4 className={styles.sectionTitle}>Avatar</h4>
        <div className="clearfix"></div>
        <div className={styles.rowWrapper}>
          <div className="pull-left">
            <div className={styles.imageWrapper}>
              <Image rounded
                className={styles.avatarImage} src={this.state.avatar} />
            </div>
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
            <input style={{display: 'none'}}
              type="file"
              accept="image/png, image/jpg"
              ref="imageInput"
              onChange={this.imageSelected} />
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
