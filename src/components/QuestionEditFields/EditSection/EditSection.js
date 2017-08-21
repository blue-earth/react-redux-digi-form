import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EditSection.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class EditSection extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired
    ]),
    withSpacing: PropTypes.bool // used to add spacing between children elements
  };

  render() {
    return (
      <div className={cx('section', {'withSpacing': this.props.withSpacing})}>
        {this.props.children}
      </div>
    );
  }
}

export default EditSection;
