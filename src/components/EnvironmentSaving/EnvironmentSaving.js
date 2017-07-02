import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EnvironmentSaving.scss';
import classNames from 'classnames/bind';

class EnvironmentSaving extends Component {
  static propTypes = {
    imageSrc: PropTypes.string,
    imageSrcSet: PropTypes.string,
    number: PropTypes.number,
    label: PropTypes.string
  }
  static defaultProps = {
    number: 0,
    label: ''
  }
  render() {
    const cx = classNames.bind(styles);
    const {number, label, imageSrc, imageSrcSet} = this.props;
    return (
      <div className={cx('envSavingWrap')}>
        <img className={cx('envSavingImage')} alt={label} src={imageSrc} srcSet={imageSrcSet} />
        <div className={cx('envSavingNumber')}>{number}</div>
        <div className={cx('envSavingLabel')}>{label}</div>
      </div>
    );
  }
}

export default EnvironmentSaving;
