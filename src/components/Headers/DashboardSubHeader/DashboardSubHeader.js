import React, { Component, PropTypes } from 'react';
import DashboardTabs from 'containers/DashboardTabsContainer';
import FormBuilderNav from 'containers/FormBuilderNavContainer';

class DashboardSubHeader extends Component {

  static propTypes = {
    location: PropTypes.object
  }

  displayComponent = () => {
    const { location: { pathname } } = this.props;
    var pathArray = pathname.split('/');
    pathArray = pathArray.filter(function(n){ return n != "" });
    // determine if we are in form builder or somewhere else
    var path = 'default';
    if (pathArray[1] === 'forms' && pathArray[3] === 'edit') {
      path = 'formBuilder';
    }
    switch (path) {
      case 'formBuilder':
        return FormBuilderNav;
      default:
        return DashboardTabs;
    }
  }
  //
  render() {
    var SubHeaderComponent = this.displayComponent();
    return (
      <div>
        {<SubHeaderComponent location={location} />}
      </div>
    );
  }
}

export default DashboardSubHeader;
