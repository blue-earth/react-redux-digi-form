import React, {
  Component,
  PropTypes
} from 'react';
import styles from './NumberInput.scss';
import CircleOutlineButton from 'components/Buttons/CircleOutlineButton/CircleOutlineButton';
import classNames from 'classnames';

class NumberInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    minHint: PropTypes.string,
    maxHint: PropTypes.string
  }
  static defaultValue = {
    minValue: 1
  }
  constructor(props) {
    super(props);
    this.state = {
      savedValue: props.value,
      displayMinHint: false,
      displayMaxHint: false
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
    const value = event.target.value;
    const { minValue, maxValue, onChange } = this.props;
    this.setState({
      displayMinHint: false,
      displayMaxHint: false
    });
    if (!value) {
      this.setState({displayMinHint: true});
      onChange(minValue);
    }
    if (minValue && value < minValue) {
      onChange(minValue);
      this.setState({displayMinHint: true});
    }
    if (maxValue && value > maxValue) {
      onChange(maxValue);
      this.setState({displayMaxHint: true});
    }
  }
  handleAddNumber = () => {
    const { maxValue, value, onChange } = this.props;
    onChange(value + 1);
    if (value+1 > maxValue) {
      onChange(value);
      this.setState({displayMaxHint: true});
    }
    this.setState({displayMinHint: false});
  }
  handleReduceNumber = () => {
    const { minValue, value, onChange } = this.props;
    onChange(value - 1);
    if (value-1 < minValue) {
      onChange(value);
      this.setState({displayMinHint: true});
    }
    this.setState({displayMaxHint: false});
  }
  render() {
    const { height, className, minValue, maxValue, minHint, maxHint } = this.props;
    const { displayMinHint, displayMaxHint } = this.state;
    return (
      <div className={styles.numberInputBlock}>
        <div className={classNames(styles.numberInputWrapper, className)}>
          <CircleOutlineButton buttonLabel="&minus;" hoverColor={"#3993d1"} color={"#DCE6ED"} size={height}
            onClick={this.handleReduceNumber}  />
          <span style={{fontSize: height+'px'}}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.numberInput}
                value={this.state.savedValue}
                onChange={this.handleChange}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnBlur} />
            </div>
          </span>
          <CircleOutlineButton buttonLabel="+" hoverColor={"#3993d1"} color={"#DCE6ED"} size={height}
            onClick={this.handleAddNumber} />
        </div>
        <div className={styles.inputHintWrapper}>
          <span className={classNames({
            'hide': !displayMinHint
          })}>{minHint}</span>
          <span className={classNames({
            'hide': !displayMaxHint
          })}>{maxHint}</span>
        </div>
      </div>
    );
  }
}

export default NumberInput;
