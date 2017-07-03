import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EnvironmentSaving.scss';
import classNames from 'classnames/bind';

class EnvironmentSaving extends Component {
  static propTypes = {
    trees: PropTypes.number,
    co2: PropTypes.number,
    water: PropTypes.number
  }
  static defaultProps = {
    trees: 0,
    co2: 0,
    water: 0
  }
  render() {
    const cx = classNames.bind(styles);
    const {trees, co2, water} = this.props;
    const imgTreePath = require('./tree.png');
    const imgWaterPath = require('./water.png');
    const imgCoPath = require('./co2.png');
    return (
      <div>
        <div className={cx('envSavingWrap')}>
          <img className={cx('envSavingImage')} alt="trees" src={imgTreePath}/>
          <div className={cx('envSavingNumber')}>{trees}</div>
          <div className={cx('envSavingLabel')}>trees</div>
        </div>
        <div className={cx('envSavingWrap')}>
          <img className={cx('envSavingImage')} alt="co2" src={imgCoPath} />
          <div className={cx('envSavingNumber')}>{co2}</div>
          <div className={cx('envSavingLabel')}>kilograms of CO<sup>2</sup></div>
        </div>
        <div className={cx('envSavingWrap')}>
          <img className={cx('envSavingImage')} alt="water" src={imgWaterPath} />
          <div className={cx('envSavingNumber')}>{water}</div>
          <div className={cx('envSavingLabel')}>liters of water</div>
        </div>
      </div>
    );
  }
}

export default EnvironmentSaving;
