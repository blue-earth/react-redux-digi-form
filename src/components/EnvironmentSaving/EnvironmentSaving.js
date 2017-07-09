import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EnvironmentSaving.scss';
import classNames from 'classnames/bind';

class EnvironmentSaving extends Component {
  static propTypes = {
    size: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.number,
    font: PropTypes.string
  }
  static defaultProps = {
    size: 'default',
    value: 0,
    type: 'trees',
    font: 'openSans'
  };
  constructor(props) {
    super(props);
    this.cx = classNames.bind(styles);
  }
  render() {
    const cx = this.cx;
    const {size, type, value, font} = this.props;
    const trees = <span>trees</span>;
    const water = <span>liters of water</span>;
    const co2 = <span>kilograms of CO<sup>2</sup></span>;
    const content = {
      trees: trees,
      water: water,
      co2: co2
    };
    const imgPath = {
      trees: require('./tree.png'),
      water: require('./water.png'),
      co2: require('./co2.png')
    };
    return (
      <div className={cx('envSavingWrap', [size])}>
        <img className={cx('envSavingImage')} alt="trees" src={imgPath[type]} />
        <div className={cx('envSavingNumber', [font])}>{value.toLocaleString('en')}</div>
        <div className={cx('envSavingLabel', [font])}>{content[type]}</div>
      </div>
    );
  }
}

export default EnvironmentSaving;
