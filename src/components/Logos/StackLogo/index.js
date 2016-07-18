import React, {
  PropTypes,
  Component
} from 'react';
import { Link } from 'react-router';

class StackLogo extends Component {

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
    logoStyle: PropTypes.string
  };

  static defaultProps = {
    width: 140,
    height: 'auto',
    link: '/',
    logoStyle: 'white'
  };

  render() {
    const {
      link,
      logoStyle,
      width,
      height
    } = this.props;
    var style = {
      'textAlign': 'center'
    };
    var logoPath;
    if (logoStyle === 'white') {
      logoPath = require('./Emondo-Logo-White.svg');
    } else {
      logoPath = require('./Emondo-Logo-Horizontal.svg');
    }
    return (
      <Link to={link}>
        <div style={style}>
          <img
            width={width}
            height={height}
            src={logoPath} />
        </div>
      </Link>
    );
  }
}

export default StackLogo;
