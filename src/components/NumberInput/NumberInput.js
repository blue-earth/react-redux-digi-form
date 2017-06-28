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
  changeValue = (number) => {
    const {minValue, maxValue, onChange} = this.props;
    this.setState({
      displayMaxHint: false,
      displayMinHint: false
    });
    if (number > maxValue) {
      this.setState({
        displayMaxHint: true
      });
      return onChange(maxValue);
    }
    if (number < minValue) {
      this.setState({
        displayMinHint: true
      });
      return onChange(minValue);
    }
    onChange(number);
  }
  handleChange = (event) => {
    const value = event.target.value;
    const number = parseInt(value);
    if (value === '') {
      this.setState({
        savedValue: ''
      });
    }
    if (number.toString() === value && number > 0) {
      this.setState({
        savedValue: number
      });
    }
  }
  handleOnFocus = () => {
    this.setState({
      savedValue: ''
    });
  }
  handleOnBlur = (event) => {
    const value = this.state.savedValue;
    this.changeValue(value);
  }
  handleAddNumber = () => {
    const value = this.state.savedValue;
    this.changeValue(value + 1);
  }
  handleReduceNumber = () => {
    const { value } = this.props;
    this.changeValue(value - 1);
  }
  render() {
    const { height, className, minHint, maxHint } = this.props;
    const { displayMinHint, displayMaxHint } = this.state;
    return (
      <span className={styles.numberInputBlock}>
        <p className={classNames(styles.numberInputWrapper, className)}>
          <CircleOutlineButton buttonLabel="&minus;" hoverColor={"#3993d1"} colour={"#DCE6ED"} size={height}
            onClick={this.handleReduceNumber} />
          <span style={{fontSize: height+'px'}}>
            <span className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.numberInput}
                value={this.state.savedValue}
                onChange={this.handleChange}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnBlur} />
            </span>
          </span>
          <CircleOutlineButton buttonLabel="+" hoverColor={"#3993d1"} colour={"#DCE6ED"} size={height}
            onClick={this.handleAddNumber} />
        </p>
        <p className={styles.inputHintWrapper}>
          <span className={classNames({
            'hide': !displayMinHint
          })}>{minHint}</span>
          <span className={classNames({
            'hide': !displayMaxHint
          })}>{maxHint}</span>
        </p>
      </span>
    );
  }
}

export default NumberInput;
