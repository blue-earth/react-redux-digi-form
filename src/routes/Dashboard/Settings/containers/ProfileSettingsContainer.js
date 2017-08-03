import connect from 'redux/utils/connect';
import {
  submitProfileSettings,
  submitPasswordSettings,
  fetchProfileSettings
} from 'redux/modules/profile';
import ProfileSettings from '../components/ProfileSettings';
import { show } from 'redux-modal';
import { reduxForm } from 'redux-form';

const mapActionCreators = {
  submitProfileSettings,
  submitPasswordSettings,
  fetchProfileSettings,
  show
};

const mapStateToProps = (state) => {
  const { isPageBusy, data } = state.profile;
  return { isPageBusy, data };
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
