import React, {
  Component,
  PropTypes
} from 'react';
import styles from './MappingToolbarLayout.scss';

export default class MappingToolbarLayout extends Component {
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
