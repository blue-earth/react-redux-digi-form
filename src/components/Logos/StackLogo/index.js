import React, {PropTypes} from 'react';

const propTypes = {
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

const defaultProps = {
  width: 140,
  height: 'auto',
  link: '/',
  logoStyle: 'white'
};

class StackLogo extends React.Component {
  render() {
    var style = {
      'textAlign': 'center'
    };
    var logoPath;
    if (this.props.logoStyle === 'white') {
      logoPath = require('./Emondo-Logo-White.svg');
    } else {
      logoPath = require('./Emondo-Logo-Horizontal.svg');
    }
    return (
      <a role="button" href={this.props.link}>
        <div style={style}>
          <img
            width={this.props.width}
            height={this.props.height}
            src={logoPath} />
        </div>
      </a>
    );
  }
}

StackLogo.propTypes = propTypes;
StackLogo.defaultProps = defaultProps;
export default StackLogo;
