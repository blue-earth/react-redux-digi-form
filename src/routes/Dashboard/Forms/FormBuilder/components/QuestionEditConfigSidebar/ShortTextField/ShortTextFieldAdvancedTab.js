import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';

class ShortTextFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    const {
      setQuestionInfo,
      currentElement
    } = this.props;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            setQuestionInfo={setQuestionInfo}
            questionPropKey={'value'}
            questionPropValue={currentElement.question.value}
            title={'Default value'}
          />
        </EditSection>
        <EditSection>
          <CollapsibleSection
            setQuestionInfo={setQuestionInfo}
            questionPropKey={'placeholder_text'}
            questionPropValue={currentElement.question.placeholder_text}
            title={'Placeholder'}
          />
        </EditSection>
      </div>
    );
  }
}

export default ShortTextFieldAdvancedTab;
