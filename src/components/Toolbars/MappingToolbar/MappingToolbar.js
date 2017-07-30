import React, {
  Component,
  PropTypes
} from 'react';
import styles from './MappingToolbar.scss';

export default class MappingToolbar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;
    return (
      <div className={styles.toolbar}>
        {children}
        <div className={styles.arrow} />
      </div>
    );
  }
}
