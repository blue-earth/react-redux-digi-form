import React, { Component, PropTypes } from 'react';
import styles from './PasswordInput.scss';
import classNames from 'classnames';

class PasswordInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
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
    mask: PropTypes.string,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    placeholderText: '',
    fullWidth: true,
    type: 'password',
    mask: "Show",
  };

  constructor(props) {
    super(props);
    this.state = {
      type: typeof props.type !== 'undefined' ? props.type : '',
      savedValue: typeof props.value !== 'undefined' ? props.value : '',
      mask: typeof props.mask !== 'undefined' ? props.mask : ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.savedValue != this.state.savedValue || nextState.mask != this.state.mask;
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

    if (typeof onChange === 'function') onChange(value);
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
      //this.refs.input.blur()
    }
  }

  toggleMask = (event) => {
    if(this.state.mask == "Show")
      this.setState({mask: "Hide",type:"text"});
    else 
      this.setState({mask: "Show",type:"password"});
  }
  
  render() {
    var props = this.props;
    var { type, value, autoFocus } = this.props;
    var { primaryColor } = this.context;
    var optionals = {};

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor
      };
    }
    if (props.placeholderText) {
      optionals['placeholder'] = props.placeholderText
    };
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled'
    };
    if (props.mask == "on") {
      optionals['mask'] = 'on'
    }
    else
    {
      optionals['mask'] = 'off'
    };

    const inputClasses = classNames({
      [styles.textInput]: true,
      [styles.fullWidth]: props.fullWidth
    });
    
    return (
      <div className={styles.passInputWrapper}>
        <input
          className={inputClasses}
          type={this.state.type}
          ref="input"
          autoFocus={autoFocus}
          value={this.state.savedValue}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          {...optionals}
        />
        <div className={styles.maskIndicator} onClick={this.toggleMask}>{ this.state.mask }</div>
      </div>
    )
  }
}

export default PasswordInput;
