import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames/bind';
import { default as OriginalDropdown } from 'react-dropdown';
import styles from './Dropdown.scss';

class Dropdown extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool, // TODO: implement style for disabled.
    isReadOnly: PropTypes.bool, // TODO: implement style for readonly.
    value: PropTypes.string,
    extraClass: PropTypes.string,
    placeholder: PropTypes.string,
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    includeBlank: PropTypes.bool, // TODO: check includeBlank is necessary.
    onEnterKey: PropTypes.func
  };
  static defaultProps = {
    placeholder: 'Select option',
    isDisabled: false,
    isReadOnly: false,
    choices: [],
    value: '',
    includeBlank: true,
    onChange: () => {},
    onEnterKey: () => {}
  };

  handleChange = (item) => {
    const { onChange, onEnterKey } = this.props;
    if (typeof onChange === 'function') {
      onChange(item.value);
    }
    if (typeof onEnterKey === 'function') {
      setTimeout(onEnterKey, 50);
    }
  }

  render() {
    const { value, extraClass, placeholder, choices } = this.props;
    const cx = classNames.bind(styles); // eslint-disable-line
    return (
      <div className={cx({
        'dropdownWrapper': true,
        'dropdownIsEmpty': value && value.length === 0 || !value
      }, extraClass)} tabIndex={0}>
        <OriginalDropdown baseClassName="Dropdown" placeholder={placeholder}
          value={value} options={choices} onChange={this.handleChange} />
      </div>
    );
  }
}

export default Dropdown;
