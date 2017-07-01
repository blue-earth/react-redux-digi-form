import React, {
  Component,
  PropTypes
} from 'react';
import validateField from 'helpers/validationHelper';
import Hogan from 'hogan.js';
import styles from './Validator.scss';

class Validator extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
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
    ]),

    /*
     * displayText: Custom notification text on error.
     */
    displayText: PropTypes.string
  };

  static defaultProps = {
    displayText: ''
  };

  static defaultMessages = {
    'isRequired': 'This field is required.',
    'isEmail': 'Please enter a valid email.',
    'minLength': 'Minimum of {{value}} charaters are required.',
    'maxLength': 'Maximum of {{value}} charaters are required.',
    'minimum': 'Value must not be less than {{value}}.',
    'maximum': 'Value must not be greater than {{value}}.'
  }

  render() {
    var { type, value, validateFor, displayText } = this.props;
    var result = validateField({type, value}, validateFor);
    var output = false;
    var template = false;
    var validatorStyle = {
      backgroundColor: this.context.primaryColour
    };

    if (result === false) {
      if (displayText) {
        template = displayText;
      } else {
        template = Validator.defaultMessages[type];
      }

      if (template) {
        var t = Hogan.compile(template);
        output = t.render(this.props);
      }

      return (
        <div className={styles.errorField} style={validatorStyle}>
          <span>{output}</span>
        </div>
      );
    } else {
      return false;
    }
  }
}

export default Validator;
