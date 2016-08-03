import React, {PropTypes} from 'react';
import connect from 'redux/utils/connect';
import {push} from 'react-router-redux';

export default function requiresAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticating: PropTypes.bool.isRquired,
      user: PropTypes.object.isRquired,
      dispatch: PropTypes.func.isRquired
    };

    componentDidMount() {
      this._checkAndRedirect();
    }
    componentDidUpdate() {
      this._checkAndRedirect();
    }
    shouldComponentUpdate(nextProps) {
      return this.props.isAuthenticating !== nextProps.isAuthenticating;
    }

    _checkAndRedirect(nextProps) {
      const {dispatch, isAuthenticating, user} = this.props;
      // todo: DRY user checking
      console.log(isAuthenticating, user);
      if (!isAuthenticating && Object.keys(user).length === 0) {
        debugger;
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

  return connect(mapStateToProps)(AuthenticatedComponent);
}
