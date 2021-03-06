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

class SignatureFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  handlePrefillName = (nameValue='') => {
    var newValue = this.props.currentElement.question.value || {};
    if (nameValue !== '') {
      nameValue = `{{ answer_${nameValue} }}`;
    }
    newValue.name = nameValue;
    this.props.setQuestionInfo({'value': newValue});
  }
  handlePrefillEmail = (emailValue='') => {
    var newValue = this.props.currentElement.question.value || {};
    if (emailValue !== '') {
      emailValue = `{{ answer_${emailValue} }}`;
    }
    newValue.email = emailValue;
    this.props.setQuestionInfo({'value': newValue});
  }

  handleConsentChange = (isOn) => {
    const { setQuestionInfo } = this.props;
    if (isOn) {
      setQuestionInfo({'consent_checkbox': true});
    } else {
      setQuestionInfo({'consent_checkbox': false});
    }
  }

  render() {
    const {
      currentElement,
      questions
    } = this.props;
    const name = _.get(currentElement, 'question.value.name', '');
    const email = _.get(currentElement, 'question.value.email', '');
    var nameQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'NameField'));
    var emailQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'EmailField'));
    var hasConsentCheckbox = currentElement.question.consent_checkbox || false;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            isInitiallyOpened={false}
            questionPropKey={'value'}
            title={'Prefill signer\'s name'}
            onToggleClosed={this.handlePrefillName}
          >
            <SelectBox value={name} appearance="shiny" fullWidth
              onChange={this.handlePrefillName}
              optionsList={nameQuestions}
              placeholder="Select name" />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <CollapsibleSection
            isInitiallyOpened={false}
            questionPropKey={'value'}
            title={'Prefill signer\'s email'}
            onToggleClosed={this.handlePrefillEmail}
          >
            <SelectBox value={email} appearance="shiny" fullWidth
              onChange={this.handlePrefillEmail}
              optionsList={emailQuestions}
              placeholder="Select email" />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <SwitchRow title="Explicit consent checkbox"
            checked={hasConsentCheckbox}
            onChange={this.handleConsentChange} />
        </EditSection>
      </div>
    );
  }
}

export default SignatureFieldAdvancedTab;
