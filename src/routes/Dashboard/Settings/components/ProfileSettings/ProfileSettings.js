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
import TimezoneList from 'schemas/timezoneList';

const timezoneList = () => {
  let list = [];
  TimezoneList.map((group) => {
    group.zones.map((timezone) => {
      list.push({
        key: timezone.value,
        label: timezone.value
      });
    });
  });
  return list;
};

class AvatarDropZoneFileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.input.value,
      errorMessage: ''
    };
    props.input.value = '';
  }
  componentWillReceiveProps(nextProps) {
    const avatar = nextProps.input.value;
    if (typeof avatar === 'string') {
      this.setState({
        avatar: avatar
      });
    } else {
      this.setState({
        avatar: avatar.preview,
        errorMessage: ''
      });
    }
  }
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  onDrop = (files) => {
    const { input } = this.props;
    input.onChange(files[0]);
    this.setState({errorMessage: ''});
  }

  selectImage = () => {
    this.refs.dropzone.open();
  }
  deleteAvatar = () => {
    this.props.input.onChange('');
  }

  onDropRejected = (files) => {
    if (files[0] && files[0].size > 1024*1024) {
      this.setState({
        errorMessage: 'Sorry, the image you selected is too large.'
      });
    }
  }

  render() {
    const dropZoneStyle = {
      width: '100%',
      height: '100%',
      borderWidth: 0,
      borderRadius: 5
    };
    const { avatar, errorMessage } = this.state;
    return (
      <div className={styles.rowWrapper}>
        <div className="pull-left">
          <div className={styles.imageWrapper}>
            <Dropzone
              onDrop={this.onDrop}
              onDropRejected={this.onDropRejected}
              ref="dropzone"
              accept="image/*"
              multiple={false}
              style={dropZoneStyle}
              disableClick
              maxSize={1024*1024}>
              <Image rounded responsive src={avatar} style={{maxHeight: '100px'}} />
            </Dropzone>
          </div>
          <div className={styles.deleteWrapper}>
            <a href="javascript:;" className={styles.linkButton} onClick={this.deleteAvatar}>
              Delete
            </a>
          </div>
        </div>
        <div className={styles.instructionsSection}>
          <p className={classNames(styles.instructions, styles.errorMessage)}>
            {errorMessage}
          </p>
          <p className={styles.instructions}>
            Drop your file to the field on the left or &nbsp;
            <a href="javascript:;" className={styles.linkButton} onClick={this.selectImage}>
              browser your disk
            </a>
            &nbsp;for file. Upload at least 256 &times; 256px PNG or JPG.
          </p>
        </div>
      </div>
    );
  };
}

class ProfileSettings extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    fetchProfileSettings: PropTypes.func.isRequired,
    submitProfileSettings: PropTypes.func.isRequired,
    submitPasswordSettings: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    isPageBusy: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.props.fetchProfileSettings();
  }

  editPassword = () => {
    this.props.show('changePasswordModal');
  }

  renderAvatarSection() {
    return (
      <section>
        <h4 className={styles.sectionTitle}>Avatar</h4>
        <div className="clearfix"></div>
        <Field name="avatar" ref="dropzone" withRef component={AvatarDropZoneFileInput} />
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
        <Field name="email" component="input" type="text" disabled
          className={classNames(styles.formInput, styles.disabledInput)} />
        <p className={styles.instructions}>
          <i>Added on {'1st July 2016'}. You appear as <strong>{'Jordan from emondo'}</strong>.</i>
        </p>
        <hr className={styles.hrLine} />
      </section>
    );
  }
  renderTimezoneSection() {
    const renderSelectField = ({ input, optionsList, ...custom }) => {
      const handleChange = (value) => input.onChange(value);
      return (
        <SelectButton
          optionsList={optionsList}
          {...input}
          {...custom}
          onChange={handleChange} />
      );
    };
    return (
      <section>
        <h4 className={styles.sectionTitle}>Timezone</h4>
        <div className="clearfix"></div>
        <Field
          name="timezone"
          component={renderSelectField}
          optionsList={timezoneList()}
          className={styles.timezoneSelection} />
        <hr className={styles.hrLine} />
      </section>
    );
  }

  render() {
    const { isPageBusy, handleSubmit, submitPasswordSettings, submitProfileSettings } = this.props;
    return (
      <form onSubmit={this.submitForm} className={styles.profileSettingForm}>
        {this.renderAvatarSection()}
        {this.renderNameSection()}
        {this.renderCredentialsSection()}
        {this.renderTimezoneSection()}
        <AppButton disabled={isPageBusy}isBusy={isPageBusy} primaryColour="#ff8a00"
          onClick={handleSubmit(submitProfileSettings)}>
          Save
        </AppButton>
        <ChangePasswordModal handleSubmit={handleSubmit(submitPasswordSettings)} />
      </form>
    );
  }
}

export default ProfileSettings;
