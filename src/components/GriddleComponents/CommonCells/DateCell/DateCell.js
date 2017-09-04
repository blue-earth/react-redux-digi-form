import React, {
  Component,
  PropTypes
} from 'react';
import moment from 'moment';

class DateCell extends Component {

  static propTypes = {
    data: PropTypes.string.isRequired
  };

  get formattedDate() {
    const { data } = this.props;
    const dateValue = moment(data);
    const dateDiff = moment().diff(dateValue);
    const aDay = 24 * 3600 * 1000;
    if (dateDiff < aDay) {
      return 'Today';
    } else if (dateDiff < 2 * aDay) {
      return 'Yesterday';
    } else {
      return dateValue.format('DD/MM/YY');
    }
  }

  render() {
    return (
      <span>{this.formattedDate}</span>
    );
  }
}

export default DateCell;
