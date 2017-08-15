import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import TextInput from 'components/TextInput';

class ShortTextFieldAdvancedTab extends Component {
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
            onToggleClosed={function () { updateQuestionProp('', 'value'); }}
          >
            <TextInput type="text" value={currentElement.question.value}
              onChange={function (x) { updateQuestionProp(x, 'value'); }} />
          </CollapsibleSection>
        </EditSection>
        <EditSection>
          <CollapsibleSection
            questionPropKey={'placeholder_text'}
            title={'Placeholder'}
            onToggleClosed={function () { updateQuestionProp('', 'placeholder_text'); }}
          >
            <TextInput type="text" value={currentElement.question.placeholder_text}
              onChange={function (x) { updateQuestionProp(x, 'placeholder_text'); }} />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default ShortTextFieldAdvancedTab;
