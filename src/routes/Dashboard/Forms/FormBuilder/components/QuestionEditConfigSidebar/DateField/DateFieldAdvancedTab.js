import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from 'components/QuestionEditFields/EditSection';
import SwitchRow from 'components/QuestionEditFields/SwitchRow';

class DateFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  handleDefaultValueChange = (isOn) => {
    if (isOn) {
      this.props.setQuestionInfo({
        'default_to_today': true
      });
    } else {
      this.props.setQuestionInfo({
        'default_to_today': false
      });
    }
  }

  render() {
    return (
      <div>
        <EditSection>
          <SwitchRow title="Default value"
            checked={this.props.currentElement.question.default_to_today || false}
            description="The current date (determined by the user's computer)"
            onChange={this.handleDefaultValueChange} />
        </EditSection>
      </div>
    );
  }
}

export default DateFieldAdvancedTab;
