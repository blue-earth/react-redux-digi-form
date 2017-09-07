import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import classNames from 'classnames/bind';
import { default as OriginalDropdown } from 'react-dropdown';
import { IoAndroidAlert } from 'react-icons/lib/io';
import styles from './Dropdown.scss';

const cx = classNames.bind(styles);

class Dropdown extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool, // TODO: implement style for disabled.
    isReadOnly: PropTypes.bool, // TODO: implement style for readonly.
    value: PropTypes.string,
    errors: PropTypes.array,
    extraClass: PropTypes.string,
    placeholder: PropTypes.string,
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func
  };
  static defaultProps = {
    placeholder: 'Select option',
    isDisabled: false,
    isReadOnly: false,
    choices: [],
    value: '',
    errors: [],
    onChange: () => {},
    onEnterKey: () => {}
  };

  get hasError() {
    return this.props.errors.length > 0;
  }

  componentDidMount() {
    if (this.hasError) {
      this.refs.errorMessage.show();
    }
  }

  componentWillReceiveProps(props) {
    if (props.errors.length > 0) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
  }

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
    const { value, errors, extraClass, placeholder, choices } = this.props;
    const tooltip = (
      <Tooltip className="inputTooltip" id="errors">
        {errors.map((error, i) => <p key={i}>{error}</p>)}
      </Tooltip>
    );
    return (
      <div className={cx({
        'dropdownWrapper': true,
        'dropdownIsEmpty': value && value.length === 0 || !value
      }, extraClass)} tabIndex={0}>
        <OriginalDropdown baseClassName="Dropdown" placeholder={placeholder}
          value={value} options={choices} onChange={this.handleChange} />
        <OverlayTrigger ref="errorMessage" placement="bottom" overlay={tooltip} trigger={['hover', 'focus']}>
          <div className={cx('errorIconWrapper')}>
            <IoAndroidAlert className={cx({
              hide: !this.hasError
            })} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

export default Dropdown;
