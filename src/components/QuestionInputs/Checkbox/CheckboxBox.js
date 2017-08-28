import React, { Component, PropTypes} from 'react';
import { MdCheck, MdClear } from 'react-icons/lib/md';
import { FaSquare } from 'react-icons/lib/fa';
import styles from './Checkbox.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class CheckboxBox extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static defaultContext = {
    primaryColour: '#3993d1'
  }

  static propTypes = {
    active: PropTypes.bool,
    appearance: PropTypes.oneOf(['fill', 'tick', 'x']),
    onClick: PropTypes.func
  };

  static defaultProps = {
    active: false,
    appearance: 'fill'
  };

  render() {
    const { active, appearance } = this.props;
    const { primaryColour } = this.context;

    const checkboxBoxClasses = cx(
      'checkboxBox', appearance,
      {
        'active': active
      }
    );

    var optionals = {};
    if (active) {
      optionals['style'] = {
        borderColor: primaryColour,
        color: primaryColour
      };
    }

    return (
      <label className={checkboxBoxClasses} {...optionals} onClick={this.props.onClick}>
        {appearance === 'tick' && <MdCheck />}
        {appearance === 'x' && <MdClear />}
        {appearance === 'fill' && <FaSquare />}
      </label>
    );
  }
}

export default CheckboxBox;
