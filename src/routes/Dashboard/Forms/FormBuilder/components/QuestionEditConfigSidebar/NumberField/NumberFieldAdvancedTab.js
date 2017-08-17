import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';
import EditSection from 'components/QuestionEditFields/EditSection';
import TextInput from 'components/TextInput';

class NumberFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  render() {
    const { currentElement, setQuestionInfo } = this.props;
    return (
      <div>
        <EditSection>
          <CollapsibleSection
            title={'Default value'}
            onToggleClosed={function () { setQuestionInfo({'value': ''}); }}
          >
            <TextInput type="text" value={currentElement.question.value}
              onChange={function (newValue) { setQuestionInfo({'value': newValue}); }} />
          </CollapsibleSection>
        </EditSection>
      </div>
    );
  }
}

export default NumberFieldAdvancedTab;
