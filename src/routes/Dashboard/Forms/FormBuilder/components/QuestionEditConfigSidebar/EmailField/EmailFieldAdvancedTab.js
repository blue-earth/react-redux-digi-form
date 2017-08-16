import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import SwitchRow from 'components/QuestionEditFields/SwitchRow';
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

  get emailQuestions() {
    const { questions } = this.props;
    var filteredQuestions = [];
    _.forEach(questions, function (q) {
      if (q.type === 'EmailField') {
        filteredQuestions.push({
          'label': `answer_${q.id}`,
          'value': `answer_${q.id}`
        });
      }
    });
    return filteredQuestions;
  }

  render() {
    const {
      currentElement,
      updateQuestionProp
    } = this.props;
    var verifications = currentElement.question.verifications;
    var hasEmondoEmailFieldService = _.indexOf(verifications, 'EmondoEmailFieldService') > -1;
    const that = this;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { updateQuestionProp('', 'value'); }}
          >
            <SelectBox value={currentElement.question.value}
              onChange={function (x) { updateQuestionProp(x, 'value'); }}
              optionsList={that.emailQuestions}
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
