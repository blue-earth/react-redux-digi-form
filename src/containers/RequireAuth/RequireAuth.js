import React, {PropTypes} from 'react';
import connect from 'redux/utils/connect';
import {
  fetchUserInfo,
  LOGGED_IN,
  setIsFetchingUserInfo,
  updateUserProfile
} from 'redux/modules/auth';
import { goTo } from 'redux/modules/router';
import { loginUrl } from 'helpers/urlHelper';

export default function requiresAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      /**
       * Indicates whether the request to fetch user is running
       */
      isAuthenticating: PropTypes.bool.isRequired,
      /**
       * The user dictionary object, includes first_name, last_name, email, and last_login
       */
      user: PropTypes.object.isRequired,
      authStatus: PropTypes.string.isRequired,
      fetchUserInfo: PropTypes.func.isRequired,
      updateUserProfile: PropTypes.func.isRequired,
      goTo: PropTypes.func.isRequired,
      location: PropTypes.object
    };

    constructor(props) {
      super(props);
      this._checkAndRedirect = this._checkAndRedirect.bind(this);
      this.state = {
        willAuthenticate: true
      };
    }
    componentDidMount() {
      this.props.fetchUserInfo();
      this.setState({
        willAuthenticate: false
      });
    }
    componentDidUpdate() {
      this._checkAndRedirect();
    }
    shouldComponentUpdate(nextProps) {
      return this.props.isAuthenticating !== nextProps.isAuthenticating ||
        this.props.location.pathname !== nextProps.location.pathname ||
        this.props.user !== nextProps.user;
    }
    _checkAndRedirect() {
      const { isAuthenticating, goTo, authStatus } = this.props;
      if (!isAuthenticating && authStatus !== LOGGED_IN) {
        goTo(loginUrl(''));
      }
    }
    render() {
      const { isAuthenticating } = this.props;
      const { willAuthenticate } = this.state;
      if (willAuthenticate || isAuthenticating) {
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
      authStatus: state.auth.authStatus,
      isAuthenticating: state.auth.isAuthenticating,
      user: state.auth.user
    };
  };
  const mapActionCreators = {
    fetchUserInfo,
    setIsFetchingUserInfo,
    updateUserProfile,
    goTo
  };

  return connect(mapStateToProps, mapActionCreators)(AuthenticatedComponent);
}
