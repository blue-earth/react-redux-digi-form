import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames/bind';
import styles from './AppButton.scss';
import Spinner from 'components/Spinner';
import lightness from 'lightness';



class AppButton extends Component {
  static propTypes = {

    /**
     * onClick handler
     */
    onClick: PropTypes.func,

    /**
     * Render the button in disabled state
     */
    isDisabled: PropTypes.bool,

    // disables the button and adds a spinner icon
    isBusy: PropTypes.bool,

    // className attribute
    extraClass: PropTypes.string,

    /**
     * lg will render the button in 64px height
     * md will render the button in 36px height
     * sm will render the button in 24px height
     */
    size: PropTypes.oneOf(['lg', 'md', 'sm']),

    primaryColour: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    size: 'md',
    primaryColour: '#3893d0',
    extraClass: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  handleClick = (e) => {
    const { onClick, isBusy } = this.props;
    if (isBusy) {
      e.preventDefault();
    } else {
      onClick.apply(this, arguments);
    }
  };

  mouseOver = () => {

    this.setState({hover: true});
  };

  mouseOut = () => {
    this.setState({hover: false});
  };

  getButtonCSSClass() {
    const {isDisabled, size} = this.props;
    var cx = classNames.bind(styles);
    return cx({
      [size]: true,
      isDisabled: isDisabled,
      button: true
    });
  }

  getOptionalAttributes() {
    const { isDisabled } = this.props;
    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = true;
    }
    return optionals;
  }
  render() {
    const { primaryColour, children } = this.props;
    let styleOverride = {
      'background': primaryColour
    };
    if (this.state.hover) {
      styleOverride['background'] = lightness(primaryColour, -10);
    }
    return (
      <button type="button" style={styleOverride} className={this.getButtonCSSClass()}
        onClick={this.onClick} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        {children}
      </button>
    );
  }
}

export default AppButton;
