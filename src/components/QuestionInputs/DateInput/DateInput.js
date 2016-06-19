import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DateInput.scss';

class DateInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      savedDate: typeof props.value !== 'undefined' ? props.value : null
    };
  }

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
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    choices: [],
    value: null,
    dateFormat: 'YYYY/MM/DD',
    onChange: () => {},
    onEnterKey: () => {}
  };

  componentDidMount() {
    const { isReadOnly } = this.props;
    if (!isReadOnly) {
      var dateInput = findDOMNode(this.refs.dateInput.refs.input);
      const that = this;
      dateInput.addEventListener('keydown', (event) => that.handleKeyDown(event));
      if (this.context.primaryColor)
        dateInput.style = 'color:' + this.context.primaryColor;
    }
  }

  handleChange = (date) => {
    const { onChange, onEnterKey } = this.props;
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
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey, onChange, dateFormat } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  }

  render() {
    const { isDisabled, isReadOnly, value, dateFormat, autoFocus } = this.props;
    const { savedDate } = this.state;
    const { primaryColor } = this.context;
    var optionals = {};

    if ( typeof savedDate === 'object' && savedDate !== null ) {
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
        <DatePicker className={styles.dateInput}
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
      );
    }
  }
}

export default DateInput;
