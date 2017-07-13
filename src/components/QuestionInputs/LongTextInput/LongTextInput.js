import React, {
  Component,
  PropTypes
} from 'react';
import styles from './LongTextInput.scss';

class LongTextInput extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    placeholderText: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    isDisabled: PropTypes.bool,
    rows: React.PropTypes.number,
    cols: React.PropTypes.number,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    placeholderText: '',
    fullWidth: false,
    rows: 6,
    cols: 50
  };

  constructor(props) {
    super(props);
    this.state = {
      savedValue: typeof props.value !== 'undefined' ? props.value : ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.savedValue !== this.state.savedValue;
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
    }
  }

  render() {
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

    return (
      <textarea
        placeholder={props.placeholderText || 'Write here...'}
        className={styles.textInput}
        rows={props.rows}
        cols={props.cols}
        value={this.state.savedValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        autoFocus={autoFocus}
        // onKeyDown={this.handleKeyDown}
        {...optionals}
      />
    );
  }
}

export default LongTextInput;
