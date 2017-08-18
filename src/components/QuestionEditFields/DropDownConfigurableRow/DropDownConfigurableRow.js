import React, {
  Component,
  PropTypes
} from 'react';
import styles from './DropDownConfigurableRow.scss';

class DropDownConfigurableRow extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired
  };

  static defaultProps = {

  };

  render() {
    return (
      <div className={styles.section}></div>
    );
  }
}

export default DropDownConfigurableRow;
