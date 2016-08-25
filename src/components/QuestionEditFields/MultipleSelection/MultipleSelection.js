import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import EditSection from '../EditSection';
import SwitchRow from '../SwitchRow';

class MultipleSelection extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    inputSchema: PropTypes.object.isRequired
  };

  get multipleSelection() {
    return _.get(this.props, ['currentElement', 'question', 'multiple_selection'], false);
  }

  handleMultipleSelection = () => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      multiple_selection: !this.multipleSelection
    });
  }

  shouldRenderSection() {
    const { inputSchema } = this.props;
    return (inputSchema.name === 'MultipleChoice');
  }

  render() {
    if (!this.shouldRenderSection()) return false;
    return (
      <EditSection>
        <SwitchRow title="Multiple Selections"
          onChange={this.handleMultipleSelection}
          checked={this.multipleSelection} />
      </EditSection>
    );
  }
}

export default MultipleSelection;
