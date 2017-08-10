import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import Color from 'color';
import styles from './FormEnterButton.scss';
import arrowEnterIcon from './arrow-enter.svg';

class FormEnterButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    buttonLabel: PropTypes.string,
    autoFocus: PropTypes.bool
  };

  static defaultProps = {
    buttonLabel: '',
    autoFocus: false
  };

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  handleClick = () => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') onClick();
  }


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
    const { buttonLabel, isDisabled, autoFocus } = this.props;
    const { primaryColour } = this.context;
    const shadowColor = Color(primaryColour).darken(0.2).rgbString();
    var optionals = {};

    if (autoFocus) {
      optionals['autoFocus'] = {
        autoFocus: true
      };
    }
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
      <Button type="button" onClick={this.handleClick}
        className={styles.formEnterButton}
        {...optionals}>
        <img className={styles.btnIcon} src={arrowEnterIcon} alt="" />
      </Button>
        {this.renderButtonLabel()}
    );
  }
}

export default FormEnterButton;
