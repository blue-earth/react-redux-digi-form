import React, { Component, PropTypes } from 'react';
import styles from './Validator.scss';

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

  renderIsRequired(inlineStyle) {
    const { validateFor } = this.props
    if (typeof validateFor !== 'undefined' && 
      (validateFor === '' || validateFor === null) ) {
      return (
        <div className={styles.errorField} style={inlineStyle}>
          <span>This field is required</span>
        </div>
      )
    } else {
      return false
    }
  }

  renderIsEmail(inlineStyle) {
    const { validateFor } = this.props
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if (typeof validateFor !== 'undefined' && !re.test(validateFor) ) {
      return (
        <div className={styles.errorField} style={inlineStyle}>
          <span>Please enter a valid email.</span>
        </div>
      )
    } else {
      return false
    }
  }

  renderMinLength(inlineStyle) {
    const { value, validateFor } = this.props
    if ( typeof validateFor !== 'undefined' && validateFor.length < value ) {
      return (
        <div className={styles.errorField} style={inlineStyle}>
          <span>Minimum of {value} charaters are required.</span>
        </div>
      )
    } else {
      return false
    }
  }

  renderMaxLength(inlineStyle) {
    const { value, validateFor } = this.props
    if (typeof validateFor !== 'undefined' && validateFor.length > value ) {
      return (
        <div className={styles.errorField} style={inlineStyle}>
          <span>Maximum of {value} charaters are required.</span>
        </div>
      )
    } else {
      return false
    }
  }

  render() {
    var { type, primaryColor } = this.props

    var validatorStyle = {
      backgroundColor: primaryColor
    }

    switch (type) {
      case 'isRequired':
        return this.renderIsRequired(validatorStyle)
      case 'minLength':
        return this.renderMinLength(validatorStyle)
      case 'maxLength':
        return this.renderMaxLength(validatorStyle)
      case 'isEmail':
        return this.renderIsEmail(validatorStyle)
    }
  }
}

export default Validator