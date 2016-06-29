import React, { Component, PropTypes } from 'react';
import classes from './CoreLayout.scss';
import '../../styles/core.scss';

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const {children} = this.props;
    return (
      <div className={classes.mainContainer}>
        {children}
      </div>
    );
  }
}

export default CoreLayout;
