import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBox from 'components/SelectBox';
import _ from 'lodash';

class EmailFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    updateQuestionProp: PropTypes.func.isRequired
  };

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
    var hasEmondoEmailFieldService = _.indexOf(verifications, 'EmondoEmailFieldService');
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
          <CollapsibleSection
            title={'Email address validation'}
            isInitiallyOpened={hasEmondoEmailFieldService !== -1}
            onToggleOpen={function () {
              verifications.push('EmondoEmailFieldService');
              updateQuestionProp(verifications, 'verifications');
            }}
            onToggleClosed={function () {
              updateQuestionProp(
                _.pull(verifications, 'EmondoEmailFieldService'),
                'verifications'
              );
            }}
          />
        </EditSection>
      </div>
    );
  }
}

export default EmailFieldAdvancedTab;
