import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from 'components/QuestionEditFields/EditSection';

class UploadFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        <EditSection>
        </EditSection>
      </div>
    );
  }
}

export default UploadFieldAdvancedTab;
