import React, {
  Component,
  PropTypes
} from 'react';
import DashboardHeader from 'containers/Headers/DashboardHeaderContainer';
// import DashboardTabs from 'containers/DashboardTabsContainer';
import DashboardSubHeader from 'components/Headers/DashboardSubHeader';
import styles from './DashboardLayout.scss';
import DashboardPageInnerLayout from 'layouts/DashboardPageInnerLayout';
import ProfileModal from 'components/ProfileModal';

const innerWrapperStyle = {
  'position': 'absolute',
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
        <DashboardHeader />
        <DashboardSubHeader location={location} />
        <div className={styles.contentWrapper}>
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
