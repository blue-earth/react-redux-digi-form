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
    choices: PropTypes.array.isRequired,
    value: PropTypes.object,
    dateFormat: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
    autoFocus: PropTypes.bool,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.element
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    choices: [],
    value: null,
    dateFormat: 'YYYY/MM/DD',
    onChange: () => {},
    onEnterKey: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      savedDate: typeof props.value !== 'undefined' ? props.value : null
    };
  }

  componentDidMount() {
    const { isReadOnly, hasError } = this.props;
    if (hasError) {
      this.refs.errorMessage.show();
    }
    if (!isReadOnly) {
      var dateInput = findDOMNode(this.refs.dateInput.refs.input);
      const that = this;
      dateInput.addEventListener('keydown', (event) => that.handleKeyDown(event));
    }
  }

  componentWillReceiveProps(props) {
    if (props.hasError) {
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
    this.setState({
      savedDate: jsonDate
    });
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
    const { isDisabled, isReadOnly, hasError, errorMessage, dateFormat, autoFocus } = this.props;
    const { savedDate } = this.state;
    const tooltip = (
      <Tooltip className="dateInputTooltip" id="tooltipQuestion_date">
        {errorMessage}
      </Tooltip>
    );
    var optionals = {};
    if (typeof savedDate === 'object' && savedDate !== null) {
      if (isReadOnly) {
        optionals['value'] = moment(savedDate).format(dateFormat);
      } else {
        optionals['selected'] = moment(savedDate);
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
        <div className={cx('dateInputWrap', {dateInputError: hasError})}>
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
                hide: !hasError
              })} />
            </div>
          </OverlayTrigger>
        </div>
      );
    }
  }
}

export default DateInput;
