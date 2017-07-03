import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EnvironmentSaving.scss';
import classNames from 'classnames/bind';

class EnvironmentSaving extends Component {
  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.number
  }
  static defaultProps = {
    value: 0
  }
  render() {
    const cx = classNames.bind(styles);
    const {type, value} = this.props;
    const trees = <span>trees</span>;
    const water = <span>liters of water</span>;
    const co2 = <span>kilograms of CO<sup>2</sup></span>
    const content = {
      trees: trees,
      water: water,
      co2: co2
    };
    const imgPath = {
      trees: require('./tree.png'),
      water: require('./water.png'),
      co2: require('./co2.png')
    }
    return (
      <div className={cx('envSavingWrap')}>
        <img className={cx('envSavingImage')} alt="trees" src={imgPath[type]}/>
        <div className={cx('envSavingNumber')}>{value.toLocaleString('en')}</div>
        <div className={cx('envSavingLabel')}>{content[type]}</div>
      </div>
    );
  }
}

export default EnvironmentSaving;
