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
}

class AvatarDropZoneFileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.input.value
    };
    props.input.value = '';
  }
  componentWillReceiveProps(nextProps) {
    const avatar = nextProps.input.value;
    if (typeof avatar === 'string') {
      this.setState({
        avatar: avatar
      });
    }
    else {
      this.setState({
        avatar: avatar.preview
      });
    }
  }
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  onDrop = (files) => {
    const { input } = this.props;
    input.onChange(files[0]);
  }

  onSelectImage = () => {
    this.refs.dropzone.open();
  }
  onDeleteAvatar = () => {
    this.props.input.onChange('');
  }

  render() {
    const dropZoneStyle = {
      width: '100%',
      height: '100%',
      borderWidth: 0,
      borderRadius: 5
    };
    const { avatar } = this.state;
    return (
      <div className={classNames(styles.imageWrapper, {[styles.noAvatar]: avatar.length === 0})}>
        <Dropzone
          onDrop={this.onDrop}
          ref="dropzone" // used for browse click
          accept="image/*"
          multiple={false}
          style={dropZoneStyle}
          disableClick={true}
          minSize={25*1024}
          maxSize={1024*1024}>
          <Image rounded responsive={true} src={avatar} style={{maxHeight: '100px'}} />
        </Dropzone>
      </div>
    );
  };
}

class ProfileSettings extends Component {
  static propTypes = {
    show: PropTypes.func.isRequired,
    fetchProfileSettings: PropTypes.func.isRequired,
    submitProfileSettings: PropTypes.func.isRequired,
    submitPasswordSettings: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    isPageBusy: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchProfileSettings();
  }

  editPassword = () => {
    this.props.show('changePasswordModal');
  }

  selectImage = () => {
    this.refs.dropzone.getRenderedComponent().onSelectImage();
  }

  deleteAvatar = () => {
    this.refs.dropzone.getRenderedComponent().onDeleteAvatar();
  }

  renderAvatarSection() {
    return (
      <section>
        <h4 className={styles.sectionTitle}>Avatar</h4>
        <div className="clearfix"></div>
        <div className={styles.rowWrapper}>
          <div className="pull-left">
            <Field name="avatar" ref="dropzone" withRef component={AvatarDropZoneFileInput} />
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
        <Field name="email" component="input" type="text" disabled className={classNames(styles.formInput, styles.disabledInput)} />
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
        <AppButton disabled={isPageBusy} isBusy={isPageBusy} primaryColour="#ff8a00" onClick={handleSubmit(submitProfileSettings)}>Save</AppButton>
        <ChangePasswordModal handleSubmit={handleSubmit(submitPasswordSettings)} />
      </form>
    );
  }
}

export default ProfileSettings;
