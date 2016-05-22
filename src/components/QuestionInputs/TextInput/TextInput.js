import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './TextInput.scss';

class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'value': ''
        }
    }

    render() {
        var props = this.props;
        var optionals = {};
        if (props.isDisabled) {
            optionals['disabled'] = 'disabled'
        }
        return (
            <input
              styleName="text-input"
              type={props.type}
              placeholder={props.placeholderText}
              {...optionals}
            />
        )
    }
}

TextInput.propTypes = {
    isRequired: React.PropTypes.bool,
    isFocused: React.PropTypes.bool, // State
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    type: React.PropTypes.string
};

TextInput.defaultProps = {
    isRequired: false,
    isFocused: true,
    isDisabled: false,
    placeholderText: '',
    initialValue: '',
    fullWidth: false,
    type: 'text'
};

export default CSSModules(TextInput, styles);



