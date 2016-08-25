import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import EditSection from '../EditSection';
import SwitchRow from '../SwitchRow';

class RequiredValidation extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    inputSchema: PropTypes.object.isRequired
  };

  handleIsRequiredChange = (isOn) => {
    const { setValidationInfo, resetValidationInfo } = this.props;
    isOn
      ? setValidationInfo({ type: 'isRequired' })
      : resetValidationInfo({ type: 'isRequired' });
  }

  render() {
    const { inputSchema } = this.props;
    if (!_.includes(inputSchema.validations, 'is_required')) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';
    return (
      <EditSection>
        <SwitchRow title="Mandatory" popoverId="isRequired"
          onChange={this.handleIsRequiredChange} checked={isRequired} />
      </EditSection>
    );
  }
}

export default RequiredValidation;
