import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import styles from './MappingToolbarLayout.scss';

export default class ToolbarCol extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired
  };

  render() {
    const { children, className } = this.props;
    return (
      <div className={classNames(styles.toolbarCol, className)}>
        {children}
      </div>
    );
  }
}
