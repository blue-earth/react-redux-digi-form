import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class PhoneNumberFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    updateQuestionProp: PropTypes.func.isRequired
  };

  handleEmailValidationChange = (isOn) => {
    const { currentElement, updateQuestionProp } = this.props;
    if (isOn) {
      currentElement.question.verifications.push('EmondoEmailFieldService');
      updateQuestionProp(currentElement.question.verifications, 'verifications');
    } else {
      updateQuestionProp(
        _.pull(currentElement.question.verifications, 'EmondoEmailFieldService'),
        'verifications'
      );
    }
  }

  render() {
    const {
      currentElement,
      updateQuestionProp
    } = this.props;
    var phoneQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'PhoneNumberField'));
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { updateQuestionProp('', 'value'); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { updateQuestionProp(newValue, 'value'); }}
              optionsList={phoneQuestions}
              placeholder="Select phone number" />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default PhoneNumberFieldAdvancedTab;
