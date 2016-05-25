import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './TextInputEmail.scss';
import { Col, Row } from 'react-bootstrap';

class TextInputEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'value': ''
    }
  }

  renderInstruction() {
    var itemTemplate = () => {
      return (
        <div styleName="email-desc">
          <span>Please enter a valid email</span>
        </div>
      )
    };

    var ItemTemplate = CSSModules(itemTemplate, this.props.styles);

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
            styleName="text-email"
            type="email"
            placeholder={props.placeholderText}
            {...optionals}
        />
      </div>
    )
  }
}

TextInputEmail.propTypes = {
    isRequired: React.PropTypes.bool.isRequired,
    isFocused: React.PropTypes.bool,
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool
};

TextInputEmail.defaultProps = {
    isRequired: true,
    isFocused: true,
    isDisabled: false,
    placeholderText: 'test@example.com',
    initialValue: '',
    fullWidth: false
};

export default CSSModules(TextInputEmail, styles);



