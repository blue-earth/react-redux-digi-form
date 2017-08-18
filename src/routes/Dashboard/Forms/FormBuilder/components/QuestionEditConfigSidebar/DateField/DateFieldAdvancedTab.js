import React, {
  Component,
  PropTypes
} from 'react';

class DateFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    updateQuestionProp: PropTypes.func.isRequired
  };
  render() {
    return (<div>advanced tab</div>);
  }
}

export default DateFieldAdvancedTab;
