import connect from 'redux/utils/connect';
import { fetchUserInfo, setIsFetchingUserInfo } from 'redux/modules/auth';
import React, {
  Component,
  PropTypes
} from 'react';

export default function setAuthContext(Component) {
  class AuthContext extends Component {
    static propTypes = {
      auth: PropTypes.object.isRequired,
      fetchUserInfo: PropTypes.func.isRequired,
      setIsFetchingUserInfo: PropTypes.func.isRequired
    };
    constructor(props) {
      super(props);

    }

    componentWillMount() {
      this.props.setIsFetchingUserInfo(true);
      this.props.fetchUserInfo();
    }
    render() {
      return (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      auth: state.auth
    };
  };
  const mapActionCreators = { fetchUserInfo, setIsFetchingUserInfo };
  return connect(mapStateToProps, mapActionCreators)(AuthContext);
}

