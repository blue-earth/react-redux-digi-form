import React, {
  Component,
  PropTypes
} from 'react';
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
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired
  };

  render() {
    const { title, onChange, checked } = this.props;
    return (
      <div className={styles.switchRow}>
        <div className={styles.switchColLeft}>
          <SectionTitle title={title} />
        </div>
        <div className={styles.switchColRight}>
          <Switch onChange={onChange} checked={checked} />
        </div>
      </div>
    );
  }
}

export default SwitchRow;
