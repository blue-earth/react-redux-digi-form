import React, { Component, PropTypes } from 'react';
import validateField from 'helpers/validationHelper';
import styles from './Validator.scss';

class Validator extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    /*
     * type: Validation type, 'isRequired', 'minLength', etc..
     */
    type: PropTypes.string.isRequired,
    /*
     * value: Output text when validation returns false
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),

    /*
     * validateFor: Value to validate
     */
    validateFor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ])
  };

  renderIsRequired() {
    return (
      <span>This field is required</span>
    );
  }

  renderIsEmail() {
    return (
      <span>Please enter a valid email.</span>
    );
  }

  renderMinLength() {
    const { value } = this.props
    return (
      <span>Minimum of {value} charaters are required.</span>
    );
  }

  renderMaxLength() {
    const { value } = this.props
    return (
      <span>Maximum of {value} charaters are required.</span>
    );
  }

  renderMinimum() {
    const { value } = this.props
    return (
      <span>Value must not be less than {value}.</span>
    );
  }

  renderMaximum() {
    const { value } = this.props
    return (
      <span>Value must not be greater than {value}.</span>
    );
  }

  render() {
    var { type, value, validateFor } = this.props
    var result = validateField({type, value}, validateFor)
    var output = false
    var validatorStyle = {
      backgroundColor: this.context.primaryColor
    };
    if (result === false) {
      switch (type) {
        case 'isRequired':
          output = this.renderIsRequired();
          break;
        case 'minLength':
          output = this.renderMinLength();
          break;
        case 'maxLength':
          output = this.renderMaxLength();
          break;
        case 'isEmail':
          output = this.renderIsEmail();
          break;
        case 'minimum':
          output = this.renderMinimum();
          break;
        case 'maximum':
          output = this.renderMaximum();
          break;
      }
    
      return (
        <div className={styles.errorField} style={validatorStyle}>
          {output}
        </div>
      )
    } else {
      return false;
    }
  }
}

export default Validator;
