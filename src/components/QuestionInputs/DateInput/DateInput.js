import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { IoAndroidAlert } from 'react-icons/lib/io';
import styles from './DateInput.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class DateInput extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    value: PropTypes.object,
    dateFormat: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
    autoFocus: PropTypes.bool,
    errors: PropTypes.array
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    errors: [],
    value: null,
    dateFormat: 'YYYY/MM/DD',
    onChange: () => {},
    onEnterKey: () => {}
  };

  componentDidMount() {
    const { isReadOnly, errors } = this.props;
    if (errors.length > 0) {
      this.refs.errorMessage.show();
    }
    if (!isReadOnly) {
      var dateInput = findDOMNode(this.refs.dateInput.refs.input);
      const that = this;
      dateInput.addEventListener('keydown', (event) => that.handleKeyDown(event));
    }
  }

  componentWillReceiveProps(props) {
    if (props.errors.length > 0) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
  }

  handleChange = (date) => {
    const { onChange } = this.props;
    var jsonDate = null;
    if (date !== null) {
      jsonDate = {
        day: date.date(),
        month: date.month(),
        year: date.year()
      };
    }
    if (typeof onChange === 'function') {
      onChange(jsonDate);
    }
  }

  handleFocus = (event) => {
    var dateInput = findDOMNode(this.refs.dateInput.refs.input);
    if (this.context.primaryColour) {
      dateInput.style = 'border-color:' + this.context.primaryColour;
    }
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    this.refs.errorMessage.hide();
    var dateInput = findDOMNode(this.refs.dateInput.refs.input);
    if (this.context.primaryColour) {
      dateInput.style = ' ';
    }
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  }

  render() {
    const { value, isDisabled, isReadOnly, errors, dateFormat, autoFocus } = this.props;
    const tooltip = (
      <Tooltip className="dateInputTooltip" id="tooltipQuestion_date">
        {errors.map((error, i) => <p key={i}>{error}</p>)}
      </Tooltip>
    );
    var optionals = {};
    if (typeof value === 'object' && value !== null) {
      if (isReadOnly) {
        optionals['value'] = moment(value).format(dateFormat);
      } else {
        optionals['selected'] = moment(value);
      }
    }
    if (isDisabled) {
      optionals['disabled'] = true;
    }

    if (isReadOnly) {
      optionals['readOnly'] = true;
      // If readonly, render native input tag instead.
      return (
        <input type="text" className={styles.dateInput}
          placeholderText={dateFormat}
          {...optionals}
        />
      );
    } else {
      return (
        <div className={cx('dateInputWrap', {dateInputError: errors.length > 0})}>
          <DatePicker className={cx('dateInput')}
            dateFormat={dateFormat}
            placeholderText={dateFormat}
            autoFocus={autoFocus}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            showYearDropdown
            ref="dateInput"
            {...optionals}
          />
          <OverlayTrigger ref="errorMessage"
            placement="bottom"
            overlay={tooltip}
            trigger={['hover', 'focus']}>
            <div className={cx('errorIconWrapper')}>
              <IoAndroidAlert className={cx({
                hide: errors.length === 0
              })} />
            </div>
          </OverlayTrigger>
        </div>
      );
    }
  }
}

export default DateInput;
