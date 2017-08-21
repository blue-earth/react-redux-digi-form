import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from '../EditSection';
import SwitchRow from '../SwitchRow';

class RequiredValidation extends Component {
  static propTypes = {
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    checked: PropTypes.bool
  };

  handleIsRequiredChange = (isOn) => {
    const { setValidationInfo, resetValidationInfo } = this.props;
    isOn
      ? setValidationInfo({ type: 'isRequired' })
      : resetValidationInfo({ type: 'isRequired' });
  }

  render() {
    return (
      <EditSection>
        <SwitchRow title="Mandatory" popoverId="isRequired"
          onChange={this.handleIsRequiredChange} checked={this.props.checked || false} />
      </EditSection>
    );
  }
}

export default RequiredValidation;
