import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from '../EditSection';
import SwitchRow from '../SwitchRow';

class MultipleSelection extends Component {
  static propTypes = {
    setQuestionInfo: PropTypes.func.isRequired,
    checked: PropTypes.bool
  };

  handleMultipleSelection = () => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      multiple_selection: !this.props.checked
    });
  }

  render() {
    return (
      <EditSection>
        <SwitchRow title="Multiple Selections"
          onChange={this.handleMultipleSelection}
          checked={this.props.checked} />
      </EditSection>
    );
  }
}

export default MultipleSelection;
