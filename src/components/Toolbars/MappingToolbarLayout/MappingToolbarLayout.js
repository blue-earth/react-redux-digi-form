import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import styles from './MappingToolbarLayout.scss';

export default class MappingToolbarLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    offset: PropTypes.number,
    placement: PropTypes.oneOf(['top', 'bottom'])
  };

  static defaultProps = {
    placement: 'top',
    offset: 0
  };

  render() {
    const { children, placement, offset } = this.props;
    return (
      <div className={classNames(styles.toolbar, styles[placement])}>
        {children}
        <div className={styles.arrow} style={{ marginLeft: -offset }} />
      </div>
    );
  }
}
