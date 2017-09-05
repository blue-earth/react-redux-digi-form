import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class PhoneNumberFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  render() {
    const {
      currentElement,
      setQuestionInfo
    } = this.props;
    var phoneQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'PhoneNumberField'));
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            isInitiallyOpened={false}
            title={'Default value'}
            onToggleClosed={function () { setQuestionInfo({'value': ''}); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { setQuestionInfo({'value': newValue}); }}
              optionsList={phoneQuestions}
              placeholder="Select phone number" />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default PhoneNumberFieldAdvancedTab;
