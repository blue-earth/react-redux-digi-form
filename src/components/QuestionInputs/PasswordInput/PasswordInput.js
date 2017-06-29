import React, { Component, PropTypes } from 'react';
import styles from './PasswordInput.scss';
import classNames from 'classnames';

class PasswordInput extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    placeholderText: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    displayMode: PropTypes.string,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    placeholderText: '',
    fullWidth: true,
    type: 'password',
    displayMode: 'marked',
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      type: typeof props.type !== 'undefined' ? props.type : '',
      savedValue: typeof props.value !== 'undefined' ? props.value : '',
      displayMode: typeof props.displayMode !== 'undefined' ? props.displayMode : ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.savedValue !== this.state.savedValue || nextState.displayMode !== this.state.displayMode;
  }

  componentWillReceiveProps(props) {
    this.setState({
      savedValue: props.value
    });
  }

  handleChange = (event) => {
    const { onChange } = this.props;
    let value = event.target.value;
    this.setState({
      savedValue: value
    });
    typeof onChange === 'function' && onChange(value);
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    typeof onFocus === 'function' && onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    typeof onBlur === 'function' && onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  }

  toggleMask = (event) => {
    if (this.state.displayMode === 'cleartext') {
      this.setState({ displayMode: 'marked', type: 'password' });
    } else {
      this.setState({ displayMode: 'cleartext', type: 'text' });
    }
  }

  render() {
    var toggleMaskIndicator ={'cleartext': 'Hide', 'marked': 'Show'};
    var props = this.props;
    var { autoFocus } = this.props;
    var { primaryColour } = this.context;
    var optionals = {};

    if (typeof primaryColour !== 'undefined') {
      optionals['style'] = {
        color: primaryColour
      };
    }
    if (props.placeholderText) {
      optionals['placeholder'] = props.placeholderText;
    }
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled';
    }

    const inputClasses = classNames({
      [styles.textInput]: true,
      [styles.fullWidth]: props.fullWidth
    });

    return (
      <div className={styles.passInputWrapper}>
        <input
          className={inputClasses}
          type={this.state.type}
          autoFocus={autoFocus}
          value={this.state.savedValue}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          {...optionals}
        />
        <div className={styles.maskIndicator} onClick={this.toggleMask}>
          {toggleMaskIndicator[this.state.displayMode]}
        </div>
      </div>
    );
  }
}

export default PasswordInput;
