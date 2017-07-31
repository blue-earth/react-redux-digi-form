import React, {
  Component,
  PropTypes
} from 'react';
import styles from './MappingToolbarLayout.scss';

export default class ToolbarRow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;
    return (
      <div className={styles.toolbarRow}>
        {children}
      </div>
    );
  }
}
