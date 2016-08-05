import React, {PropTypes} from 'react';
import connect from 'redux/utils/connect';
import {
  fetchUserInfo,
  setIsFetchingUserInfo
} from 'redux/modules/auth';
import { goTo } from 'redux/modules/router';

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
      setIsFetchingUserInfo: PropTypes.func.isRequired,
      fetchUserInfo: PropTypes.func.isRequired,
      goTo: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this._checkAndRedirect = this._checkAndRedirect.bind(this);
      this.state = {
        willAuthenticate: true
      };
    }
    componentDidMount() {
      this.props.setIsFetchingUserInfo(true);
      this.props.fetchUserInfo();
      this.setState({
        willAuthenticate: false
      });
    }
    componentDidUpdate() {
      this._checkAndRedirect();
    }
    shouldComponentUpdate(nextProps) {
      return this.props.isAuthenticating !== nextProps.isAuthenticating
        || this.props.location.pathname !== nextProps.location.pathname;
    }
    _checkAndRedirect() {
      const { isAuthenticating, user, goTo } = this.props;
      if (!isAuthenticating && Object.keys(user).length === 0) {
        goTo('/login');
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
      isAuthenticating: state.auth.isAuthenticating,
      user: state.auth.user
    };
  };
  const mapActionCreators = {
    fetchUserInfo,
    setIsFetchingUserInfo,
    goTo
  };

  return connect(mapStateToProps, mapActionCreators)(AuthenticatedComponent);
}
