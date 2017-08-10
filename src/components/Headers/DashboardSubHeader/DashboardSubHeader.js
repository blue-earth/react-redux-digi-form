import React, { Component, PropTypes } from 'react';
import DashboardTabs from 'containers/DashboardTabsContainer';
import FormBuilderNav from 'containers/FormBuilderNavContainer';

class DashboardSubHeader extends Component {

  static propTypes = {
    location: PropTypes.object
  }

  displayComponent = () => {
    const { location: { pathname } } = this.props;
    // TODO: is there a better way to figure out where we are?
    var pathArray = pathname.split('/');
    pathArray = pathArray.filter(function (n) { return n !== ''; });
    // determine if we are in form builder or somewhere else
    var path = 'default';
    if (pathArray[1] === 'forms' && pathArray[3] === 'edit') {
      path = 'formBuilder';
    }
    if (pathArray[1] === 'forms' && pathArray[2] === 'new') {
      path = 'formBuilder';
    }
    switch (path) {
      case 'formBuilder':
        return (<FormBuilderNav location={this.props.location} />);
      default:
        return (<DashboardTabs location={this.props.location} />);
    }
  }

  render() {
    // var SubHeaderComponent = this.displayComponent();
    return (
      <div>{this.displayComponent()}</div>
    );
  }
}

export default DashboardSubHeader;
