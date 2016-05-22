import React, { PropTypes } from 'react';
import styles from './NoLinkHeader.scss';
import CSSModules from 'react-css-modules';

const propTypes = {
  height: PropTypes.number
};

const defaultProps = {
  height: 70
};


class NoLinkHeader extends React.Component {
  render() {
    var divStyle = {
      height: this.props.height
    };
    return <div style={divStyle} styleName="header">
      {this.props.children}
    </div>
  }
}

NoLinkHeader.propTypes = propTypes;
NoLinkHeader.defaultProps = defaultProps;

export default CSSModules(NoLinkHeader, styles);