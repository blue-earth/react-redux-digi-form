import React, { Component, PropTypes } from 'react';
import styles from './TextInputEmail.scss';
import { Col, Row } from 'react-bootstrap';

class TextInputEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'value': ''
    }
  }

  static propTypes = {
    isRequired: React.PropTypes.bool.isRequired,
    isFocused: React.PropTypes.bool,
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool
  };

  static defaultProps = {
    isRequired: true,
    isFocused: true,
    isDisabled: false,
    placeholderText: 'test@example.com',
    initialValue: '',
    fullWidth: false
  };

  renderInstruction() {
    var ItemTemplate = () => {
      return (
        <div className={styles.emailDesc}>
          <span>Please enter a valid email</span>
        </div>
      )
    };

    return <ItemTemplate />;
  }

  render() {
    var props = this.props;
    var optionals = {};
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled'
    }
    if (props.isFocused) {
      optionals['autofocus'] = true;
    }
    if (props.isRequired) {
      optionals['required'] = true;
    }

    return (
      <div>
        {this.renderInstruction()}
        <input
            className={styles.textEmail}
            type="email"
            placeholder={props.placeholderText}
            {...optionals}
        />
      </div>
    )
  }
}

export default TextInputEmail



