import connect from 'redux/utils/connect';
import { submitLoginForm, INIT_AUTH_STATE } from 'redux/modules/auth';
import { goTo } from 'redux/modules/router.js';
import LoginFormView from '../components/LoginFormView';

const mapActionCreators = {
  submitLoginForm,
  goTo
};

const mapStateToProps = (state) => {
  const { auth } = state;
  const {
    authStatus
  } = auth || INIT_AUTH_STATE;
  return {
    authStatus
  };
};

export default connect(mapStateToProps, mapActionCreators)(LoginFormView);
