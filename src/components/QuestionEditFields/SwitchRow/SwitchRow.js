import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import Switch from 'rc-switch';
import SectionTitle from '../SectionTitle';
import styles from './SwitchRow.scss';

class SwitchRow extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired
    ]),
    title: PropTypes.string.isRequired,
    popoverId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    className: PropTypes.string
  };

  render() {
    const { title, onChange, checked, className, popoverId } = this.props;
    return (
      <div className={classNames(styles.switchRow, className)}>
        <div className={styles.switchColLeft}>
          <SectionTitle title={title} popoverId={popoverId} />
        </div>
        <div className={styles.switchColRight}>
          <Switch onChange={onChange} checked={checked} />
        </div>
      </div>
    );
  }
}

export default SwitchRow;
