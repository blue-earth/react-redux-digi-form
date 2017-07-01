import React, {
  PropTypes,
  Component
} from 'react';
import { Link } from 'react-router';

export default class StackLogo extends Component {

  static propTypes = {
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    link: PropTypes.string,
    logoStyle: PropTypes.string,
    url: PropTypes.string
  };

  static defaultProps = {
    width: 140,
    height: 'auto',
    link: '/',
    logoStyle: 'white',
    url: ''
  };

  render() {
    const {
      link,
      url,
      logoStyle,
      width,
      height
    } = this.props;
    var logoUrl = url;
    if (!logoUrl) {
      if (logoStyle === 'white') {
        logoUrl = require('./Emondo-Logo-White.svg');
      } else if (logoStyle === 'darkgrey') {
        logoUrl = require('./Emondo-Logo-Darkgrey.svg');
      } else {
        logoUrl = require('./Emondo-Logo-Horizontal.svg');
      }
    }
    return (
      <Link to={link}>
        <div className="text-center">
          <img
            width={width}
            height={height}
            src={logoUrl} />
        </div>
      </Link>
    );
  }
}
