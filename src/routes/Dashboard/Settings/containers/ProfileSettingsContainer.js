import connect from 'redux/utils/connect';
import {
  resetErrorMessages,
  submitProfileSettings,
  submitPasswordSettings,
  fetchProfileSettings
} from 'redux/modules/profile';
import ProfileSettings from '../components/ProfileSettings';
import { show } from 'redux-modal';
import { reduxForm } from 'redux-form';

const mapActionCreators = {
  resetErrorMessages,
  submitProfileSettings,
  submitPasswordSettings,
  fetchProfileSettings,
  show
};

const mapStateToProps = (state) => {
  const { isPageBusy, data, errorMessages } = state.profile;
  return { isPageBusy, data, errorMessages };
};

const WrappedSignUpForm = connect(mapStateToProps, mapActionCreators)(ProfileSettings);

export default connect(
  state => ({
    initialValues: state.profile.data
  })
)(reduxForm({
  form: 'profileSettingForm',
  enableReinitialize: true
})(WrappedSignUpForm));
