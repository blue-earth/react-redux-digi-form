import React, {
  Component,
  PropTypes
} from 'react';

class BaseIcon extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
  }
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="currentColor" {...this.props}>
        {this.props.children}
      </svg>
    );
  }
}

export default BaseIcon;
