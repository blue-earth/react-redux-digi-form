import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SwitchRow from 'components/QuestionEditFields/SwitchRow';
import SelectBox from 'components/SelectBox';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class AddressFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  handleAutocompleteChange = (isOn) => {
    const { setQuestionInfo } = this.props;
    if (isOn) {
      setQuestionInfo({'autocomplete': true});
    } else {
      setQuestionInfo({'autocomplete': false});
    }
  }

  render() {
    const {
      currentElement,
      setQuestionInfo
    } = this.props;
    var addressQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'AddressField'));
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            questionPropKey={'value'}
            title={'Default value'}
            onToggleClosed={function () { setQuestionInfo({'value': ''}); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { setQuestionInfo({'value': `{{ answer_${newValue} }}`}); }}
              optionsList={addressQuestions}
              placeholder="Select address" />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <SwitchRow title="Address auto complete"
            checked={currentElement.question.autocomplete || false}
            onChange={this.handleAutocompleteChange} />
        </EditSection>
      </div>
    );
  }
}

export default AddressFieldAdvancedTab;
