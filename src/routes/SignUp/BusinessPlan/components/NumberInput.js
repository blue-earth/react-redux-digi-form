import React, {
  Component,
  PropTypes
} from 'react';
import styles from './NumberInput.scss';
import CircleOutlineButton from 'components/Buttons/CircleOutlineButton/CircleOutlineButton';

class NumberInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number
  }
  static defaultValue = {
    minValue: 1
  }
  constructor(props) {
    super(props);
    this.state = {
      savedValue: props.value
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      savedValue: props.value
    });
  }
  handleChange = (event) => {
    const { onChange } = this.props;
    const value = event.target.value;
    const number = parseInt(value);
    if (value === '') {
      this.setState({
        savedValue: ''
      });
    }
    if (number.toString() === value && number > 0) {
      onChange(number);
    }
  }
  handleOnFocus = () => {
    this.setState({
      savedValue: ''
    });
  }
  handleOnBlur = (event) => {
    if (!event.target.value) {
      this.props.onChange(1);
    }
  }
  handleAddNumber = () => {
    const { value, onChange } = this.props;
    onChange(value+1);
  }
  handleReduceNumber = () => {
    const { value, onChange } = this.props;
    onChange(value-1);
  }
  render() {
    const { height, className, minValue, maxValue } = this.props;
    const width = Math.round(height * 1.85) + 'px';
    return (
      <span className={styles.numberInputWrapper + ' ' + className}>
        <CircleOutlineButton buttonLabel="&minus;" size={height} hoverColor={"#3993d1"} color={"#DCE6ED"}
          onClick={this.handleReduceNumber} isDisabled={this.props.value === minValue} />
        <input
          style={{
            height: height + 'px',
            width
          }}
          type="text"
          className={styles.numberInput}
          value={this.state.savedValue}
          onChange={this.handleChange}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur} />
        <CircleOutlineButton buttonLabel="+" size={height} hoverColor={"#3993d1"} color={"#DCE6ED"}
          isDisabled={this.props.value === maxValue} onClick={this.handleAddNumber} />
      </span>
    );
  }
}

export default NumberInput;
