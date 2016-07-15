import React, {
  Component,
  PropTypes
} from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import classes from './DashboardLayout.scss';

class DashboardLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const {children} = this.props;
    return (
      <div className={classes.dashboard}>
        <BuilderHeader />
        <div className={classes.contentWrapper}>
          {children}
        </div>
      </div>
    );
  }
}

export default DashboardLayout;
