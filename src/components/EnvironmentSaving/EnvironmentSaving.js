import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EnvironmentSaving.scss';
import classNames from 'classnames/bind';

const content = {
  trees: <span>trees</span>,
  water: <span>liters of water</span>,
  co2: <span>kilograms of CO<sup>2</sup></span>
};
const imgPath = {
  trees: require('./tree.png'),
  water: require('./water.png'),
  co2: require('./co2.png')
};
/**
 * Environment saving table from :
 * https://docs.google.com/spreadsheets/d/1PEROs77QzY4lRGfT1KLtfm0YYteZp3pT5X60MPhU9XY/edit?usp=sharing
 */
const valueRatio = {
  trees: 0.00013,
  water: 0.122,
  co2: 0.0068
};
const cx = classNames.bind(styles);
class EnvironmentSaving extends Component {
  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.number,
    numberOfPages: PropTypes.number,
    isWidget: PropTypes.bool
  }
  static defaultProps = {
    numberOfPages: 0,
    type: 'trees',
    isWidget: false
  };

  /**
   * Format general environmental saving value
   * 100 < value No decimal
   * 0.01 < value < 10 One digit of decimal
   * value > 0.01 Two digit of decimal
   */
  formatValue = (value) => {
    if (value > 100) {
      value = Math.round(value);
    }
    if (value > 10) {
      value = Math.round(value * 10) / 10;
    }
    if (value > 0.01) {
      value = Math.round(value * 100) / 100;
    }
    // Check toLocalString browser capability.
    if (Number.toLocaleString) {
      return value.toLocaleString('en');
    }
    return value;
  }

  /**
   * Caculate trees saving value and display
   * < 1% display two decimals with %
   * < 1 display no decimals
   */
  get treesValue() {
    const {type, numberOfPages, value} = this.props;
    const num = value || numberOfPages * valueRatio[type];
    if (num < 0.01) {
      return num === 0 ? 0 : Math.round(num * 10000) / 100 + '%';
    }
    if (num < 1) {
      return Math.round(num * 100) + '%';
    }
    return this.formatValue(num);
  }
  get waterValue() {
    const {type, numberOfPages, value} = this.props;
    const num = value || numberOfPages * valueRatio[type];
    return this.formatValue(num);
  }
  get co2Value() {
    const {type, numberOfPages, value} = this.props;
    const num = value || numberOfPages * valueRatio[type];
    return this.formatValue(num);
  }

  render() {
    const {type, isWidget} = this.props;
    return (
      <div className={cx('envSavingWrap', {'isWidget': isWidget})}>
        <img className={cx('envSavingImage')} alt={type} src={imgPath[type]} />
        <div className={cx('envSavingNumber')}>{ this[type + 'Value'] }</div>
        <div className={cx('envSavingLabel')}>{content[type]}</div>
      </div>
    );
  }
}

export default EnvironmentSaving;
