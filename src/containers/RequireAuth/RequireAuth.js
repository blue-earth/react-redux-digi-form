import React, {PropTypes} from 'react';
import connect from 'redux/utils/connect';
import { push } from 'react-router-redux';
import {
  fetchUserInfo,
  setIsFetchingUserInfo
} from 'redux/modules/auth';

export default function requiresAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticating: PropTypes.bool.isRquired,
      user: PropTypes.object.isRquired,
      dispatch: PropTypes.func.isRquired,
      setIsFetchingUserInfo: PropTypes.func.isRquired,
      fetchUserInfo: PropTypes.func.isRquired
    };
    constructor(props) {
      super(props);
      this._checkAndRedirect = this._checkAndRedirect.bind(this);
    }
    componentDidMount() {
      this.props.setIsFetchingUserInfo(true);
      this.props.fetchUserInfo();
    }
    componentDidUpdate() {
      this._checkAndRedirect();
    }
    shouldComponentUpdate(nextProps) {
      return this.props.isAuthenticating !== nextProps.isAuthenticating;
    }
    _checkAndRedirect() {
      const {dispatch, isAuthenticating, user} = this.props;
      if (!isAuthenticating && Object.keys(user).length === 0) {
        dispatch(push('/login'));
      }
    }
    render() {
      const { isAuthenticating } = this.props;
      if (isAuthenticating) {
        // todo: Replace with loading state component
        return (<h1>Fetching user information</h1>);
      } else {
        return (
          <Component {...this.props} />
        );
      }
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticating: state.auth.isAuthenticating,
      user: state.auth.user
    };
  };
  const mapActionCreators = { fetchUserInfo, setIsFetchingUserInfo };
  return connect(mapStateToProps, mapActionCreators)(AuthenticatedComponent);
}
