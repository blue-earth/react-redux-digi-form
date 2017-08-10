import React, {
  Component,
  PropTypes
} from 'react';
import Color from 'color';
import styles from './FormEnterButton.scss';
import arrowEnterIcon from './arrow-enter.svg';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class FormEnterButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    buttonLabel: PropTypes.string,
    displayIcon: PropTypes.bool
  };

  static defaultProps = {
    buttonLabel: '',
    autoFocus: false,
    displayIcon: true,
    onClick: () => {}
  };

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  renderButtonLabel() {
    const { buttonLabel } = this.props;
    if (buttonLabel) {
      return (
        <div className={cx('btnDefaultInner')}>
          {buttonLabel}
        </div>
      );
    } else {
      return (
        <div className={cx('btnDefaultInner')}>
          <div>press <br />ENTER</div>
        </div>
      );
    }
  }

  render() {
    const { isDisabled, displayIcon, onClick } = this.props;
    const { primaryColour } = this.context;
    const shadowColor = Color(primaryColour).darken(0.2).rgbString();
    var optionals = {};
    if (typeof primaryColour !== 'undefined') {
      optionals['style'] = {
        backgroundColor: primaryColour,
        boxShadow: `0 3px 1px ${shadowColor}`
      };
    }
    if (isDisabled) {
      optionals['disabled'] = true;
    }
    return (
      <button type="button" onClick={onClick}
        className={cx('formEnterButton', {noIcon: !displayIcon})}
        {...optionals}>
        { displayIcon && <img className={cx('btnIcon')} src={arrowEnterIcon} alt="" />}
        {this.renderButtonLabel()}
      </button>
    );
  }
}

export default FormEnterButton;
