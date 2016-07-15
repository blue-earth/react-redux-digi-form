import React, {
  PropTypes,
  Component
} from 'react';
import { connect } from 'react-redux';
import { goTo } from 'redux/modules/router';
import { bindActionCreators } from 'redux';

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
    logoStyle: PropTypes.string,
    goTo: PropTypes.func
  };

  static defaultProps = {
    width: 140,
    height: 'auto',
    link: '/',
    logoStyle: 'white'
  };

  handleLogoClick = (event) => {
    const { link, goTo } = this.props;
    goTo(link);
    event.preventDefault();
  }
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
      <a role="button" href={link} onClick={this.handleLogoClick}>
        <div style={style}>
          <img
            width={width}
            height={height}
            src={logoPath} />
        </div>
      </a>
    );
  }
}

const mapActionCreators = {
  goTo
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
};

export default connect(null, mapDispatchToProps)(StackLogo);
