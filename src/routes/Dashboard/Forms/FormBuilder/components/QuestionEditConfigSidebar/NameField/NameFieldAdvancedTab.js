import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import TextInput from 'components/TextInput';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class NameFieldAdvancedTab extends Component {
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
    var nameQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'NameField'));
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { setQuestionInfo({'value': ''}); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { setQuestionInfo({'value': newValue}); }}
              optionsList={nameQuestions}
              placeholder="Select name" />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <CollapsibleSection
            title={'Placeholder text'}
            onToggleClosed={function () { setQuestionInfo({'placeholder': ''}); }}
          >
            <TextInput value={currentElement.question.placeholder} fullWidth
              onChange={function (newValue) { setQuestionInfo({'placeholder': newValue}); }}
            />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default NameFieldAdvancedTab;
