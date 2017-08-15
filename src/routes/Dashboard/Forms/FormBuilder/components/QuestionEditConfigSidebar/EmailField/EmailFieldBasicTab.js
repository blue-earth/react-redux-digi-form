import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';

class EmailFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    return (<div>
      <InstructionDescription {...this.props} />
      <EditSection>
        <AnswerOutputTypeStatus
          status={this.props.currentElement.defaultMappingType} />
      </EditSection>
      <RequiredValidation {...this.props} />
    </div>);
  }
}

export default EmailFieldBasicTab;
