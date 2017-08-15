import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import TextInput from 'components/TextInput';

class EmailFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    updateQuestionProp: PropTypes.func.isRequired
  };

  render() {
    const {
      currentElement,
      updateQuestionProp
    } = this.props;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            questionPropKey={'value'}
            title={'Default value'}
            onToggleOpen={updateQuestionProp}
          >
            <TextInput type="text" value={currentElement.question.value}
              onChange={function (x) { updateQuestionProp(x, 'value'); }} />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default EmailFieldAdvancedTab;
