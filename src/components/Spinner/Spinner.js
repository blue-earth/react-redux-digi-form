import React, {
  Component,
  PropTypes
} from 'react';
import styles from './Spinner.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
class Spinner extends Component {
  static propTypes = {
    primaryColour: PropTypes.string,
    size: PropTypes.oneOf(['lg', 'md', 'sm'])
  }
  static defaultProps = {
    size: 'md'
  }

  render() {
    const {primaryColour, size} = this.props;
    return (
      <div className={cx('spinnerWrapper', {[size]: true})}>
        <div className={cx('spinnerPositioner')}>
          <div className={cx('spinner', {primary: primaryColour})}>
            <div className={cx('spinner-after')} style={{backgroundColor: primaryColour}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Spinner;
