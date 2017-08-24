import React, { Component, PropTypes } from 'react';
import FormBuilderNav from 'containers/FormBuilderNavContainer';
import { subHeaderType } from 'helpers/urlHelper';

class DashboardSubHeader extends Component {

  static propTypes = {
    location: PropTypes.object
  }

  displayComponent = () => {
    const { location } = this.props;
    const type = subHeaderType(location.pathname);
    switch (type) {
      case 'formBuilder':
        return (<FormBuilderNav location={location} />);
      default:
        return;
    }
  }

  render() {
    return (
      <div>{this.displayComponent()}</div>
    );
  }
}

export default DashboardSubHeader;
