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
    width: 'auto',
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
        logoUrl = require('./Emondo-Logo-Horizontal.png');
        // svg scaling in IE is dodgy unless you set both width and height
        // so because this logo version is for the conversational form header
        // and may be dynamically replaced with a user logo where we don't want to set both w and h
        // it's best to just use a png
      }
    }
    return (
      <Link to={link}>
        <div className="text-center">
          <img
            style={{width: width, height: height}}
            src={logoUrl} />
        </div>
      </Link>
    );
  }
}
