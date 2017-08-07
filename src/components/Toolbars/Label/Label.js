import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import styles from './Label.scss';

export default class Label extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { children, className } = this.props;
    return (
      <label className={classNames(className, styles.label)}>
        {children}
      </label>
    );
  }
}
