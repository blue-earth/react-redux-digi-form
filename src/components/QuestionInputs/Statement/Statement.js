import React, {
  Component,
  PropTypes
} from 'react';
import styles from './Statement.scss';
import classNames from 'classnames/bind';

class Statement extends Component {

  static propTypes = {
    instruction: PropTypes.string
  };

  static defaultProps = {
    instruction: ''
  };

  render() {
    const { instruction } = this.props;
    const cx = classNames.bind(styles);

    return (
      <div className={cx('statement')}
        dangerouslySetInnerHTML={{__html: instruction}}>
      </div>
    );
  }
}

export default Statement;
