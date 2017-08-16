import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import SwitchRow from 'components/QuestionEditFields/SwitchRow';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class EmailFieldAdvancedTab extends Component {
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
    var emailQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'EmailField'));
    var verifications = currentElement.question.verifications;
    var hasEmondoEmailFieldService = _.indexOf(verifications, 'EmondoEmailFieldService') > -1;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { updateQuestionProp('', 'value'); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { updateQuestionProp(newValue, 'value'); }}
              optionsList={emailQuestions}
              placeholder="Select email address" />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <SwitchRow title="Email address validation" popoverId="emailAddressValidation"
            checked={hasEmondoEmailFieldService}
            onChange={this.handleEmailValidationChange} />
        </EditSection>
      </div>
    );
  }
}

export default EmailFieldAdvancedTab;
