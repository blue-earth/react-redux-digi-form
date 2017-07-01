import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames/bind';
import { default as OriginalDropdown } from 'react-dropdown';
import './Dropdown.scss';

class Dropdown extends Component {
  static propTypes = {
    value: PropTypes.string,
    extraClass: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func
  }

  render() {
    const { value, extraClass, placeholder, options, onChange } = this.props;
    return (
      <div className={ classNames({
        'dropdownIsEmpty': value && value.length === 0 || !value
       }, extraClass)}>
        <OriginalDropdown baseClassName="Dropdown" placeholder={placeholder}
          value={value} options={options} onChange={onChange} />
      </div>
    );
  }
}

export default Dropdown;
