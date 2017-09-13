import React, {
  Component,
  PropTypes
} from 'react';
import DashboardHeader from 'containers/Headers/DashboardHeaderContainer';
import DashboardSubHeader from 'components/Headers/DashboardSubHeader';
import styles from './DashboardLayout.scss';
import DashboardPageInnerLayout from 'layouts/DashboardPageInnerLayout';
import ProfileModal from 'components/ProfileModal';
import { subHeaderType } from 'helpers/urlHelper';
import classNames from 'classnames';

const innerWrapperStyle = {
  'position': 'absolute',
  'paddingBottom': '25px',
  'overflow': 'auto',
  'top': 0,
  'left': 0,
  'right': 0,
  'bottom': 0
};

class DashboardLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object,
    user: PropTypes.object.isRequired,
    updateUserProfile: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showProfileModal: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (!user.first_name || !user.last_name) {
      this.setState({ showProfileModal: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.first_name || !nextProps.user.last_name) {
      this.setState({ showProfileModal: true });
    } else {
      this.setState({ showProfileModal: false });
    }
  }

  handleHideProfileModal = () => {
    this.setState({ showProfileModal: false });
  }

  render() {
    const {
      children,
      location,
      user
    } = this.props;
    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <DashboardHeader location={location} />
          <DashboardSubHeader location={location} />
        </div>
        <div className={classNames(
          styles.contentWrapper,
          {[styles.hasSubHeader]: subHeaderType(location.pathname)})}>
          <DashboardPageInnerLayout extraStyle={innerWrapperStyle}>
            {children}
          </DashboardPageInnerLayout>
        </div>
        <ProfileModal user={user} show={this.state.showProfileModal}
          handleHide={this.handleHideProfileModal}
          updateUserProfile={this.props.updateUserProfile} />
      </div>
    );
  }
}

export default DashboardLayout;
