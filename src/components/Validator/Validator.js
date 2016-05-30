import React, { Component, PropTypes } from 'react'
import validateField from 'helpers/validationHelper'
import styles from './Validator.scss'

class Validator extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),
    validateFor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),
    primaryColor: PropTypes.string
  };

  renderIsRequired() {
    return (
      <span>This field is required</span>
    )
  }

  renderIsEmail() {
    return (
      <span>Please enter a valid email.</span>
    )
  }

  renderMinLength() {
    const { value } = this.props
    return (
      <span>Minimum of {value} charaters are required.</span>
    )
  }

  renderMaxLength() {
    const { value } = this.props
    return (
      <span>Maximum of {value} charaters are required.</span>
    )
  }

  render() {
    var { type, value, validateFor, primaryColor } = this.props
    var result = validateField({type, value}, validateFor)
    var output = false
    var validatorStyle = {
      backgroundColor: primaryColor
    }
    if (result === false) {
      switch (type) {
        case 'isRequired':
          output = this.renderIsRequired()
          break
        case 'minLength':
          output = this.renderMinLength()
          break
        case 'maxLength':
          output = this.renderMaxLength()
          break
        case 'isEmail':
          output = this.renderIsEmail()
          break
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

export default Validator