import React, {
  Component,
  PropTypes
} from 'react';
import CollapsibleSection from 'components/QuestionEditFields/CollapsibleSection';

class ShortTextFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    const {
      setQuestionInfo
    } = this.props;
    return (
      <div>
        <CollapsibleSection
          setQuestionInfo={setQuestionInfo}
          questionPropKey={'value'}
          title={'Default value'}
        />
      </div>
    );
  }
}

export default ShortTextFieldAdvancedTab;
