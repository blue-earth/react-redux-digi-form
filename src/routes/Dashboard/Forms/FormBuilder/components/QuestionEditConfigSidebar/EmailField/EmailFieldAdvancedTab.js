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
    setQuestionInfo: PropTypes.func.isRequired
  };

  handleEmailValidationChange = (isOn) => {
    const { setQuestionInfo } = this.props;
    var verifications = this.props.currentElement.question.verifications;
    if (isOn) {
      verifications.push('EmondoEmailFieldService');
      setQuestionInfo({'verifications': verifications});
    } else {
      setQuestionInfo({
        'verifications': _.pull(verifications, 'EmondoEmailFieldService')
      });
    }
  }

  render() {
    const {
      currentElement,
      setQuestionInfo
    } = this.props;
    var emailQuestions = mapQuestionsToDropdown(getQuestionsByType(this.props.questions, 'EmailField'));
    var verifications = currentElement.question.verifications;
    var hasEmondoEmailFieldService = _.indexOf(verifications, 'EmondoEmailFieldService') > -1;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { setQuestionInfo({'value': ''}); }}
          >
            <SelectBox value={currentElement.question.value} appearance="shiny" fullWidth
              onChange={function (newValue) { setQuestionInfo({'value': newValue}); }}
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
