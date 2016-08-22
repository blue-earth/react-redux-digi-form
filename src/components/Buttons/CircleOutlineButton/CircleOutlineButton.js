import React,
{ Component,
  PropTypes } from 'react';
import styles from './CircleOutlineButton.scss';

class CircleOutlineButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    buttonLabel: PropTypes.string,
    color: PropTypes.string,        // The main line color for the button, eg: 'white', '#333', 'rgba(127,127,127,1)'
    hoverColor: PropTypes.string,
    size: PropTypes.number          // The size of the button
  };

  static defaultProps = {
    buttonLabel: '+',
    color: '#333',
    hoverColor: 'black',
    size: 30
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.isDisabled) {
      this.setState({
        hover: false
      });
    }
  }

  handleClick = () => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick();
    }
  }
  handleHoverIn = () => {
    const { isDisabled } = this.props;
    this.setState({
      hover: !isDisabled
    });
  }
  handleHoverOut = () => {
    this.setState({
      hover: false
    });
  }

  getButtonStyle() {
    const { isDisabled, color, hoverColor, size } = this.props;
    let themeColor = this.state.hover ? hoverColor : color;
    themeColor = isDisabled ? color : themeColor;
    return {
      width: size + 'px',
      height: size + 'px',
      color: themeColor,
      border: '1px solid '+ themeColor
    };
  }

  render() {
    const { isDisabled } = this.props;

    return (
      <button type="button"
        onClick={this.handleClick}
        onMouseEnter={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
        style={this.getButtonStyle()}
        className={styles.circleOutlineButton}
        disabled={isDisabled}>
        <span className={styles.buttonLabel}>{this.props.buttonLabel}</span>
      </button>
    );
  }
}

export default CircleOutlineButton;
