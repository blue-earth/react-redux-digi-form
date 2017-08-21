import React, {
  Component,
  PropTypes
} from 'react';

import {
  Col
} from 'react-bootstrap';
import _ from 'lodash';
import EditRow from '../EditRow';
import EditSection from '../EditSection';
import SectionTitle from '../SectionTitle';
import TextInput from 'components/TextInput';

class LengthValidation extends Component {
  static propTypes = {
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    minLengthValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])]),
    maxLengthValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])])
  };

  static defaultProps = {
    minLengthValue: '',
    maxLengthValue: ''
  };

  handleMinLengthChange = (inputValue) => {
    const value = _.defaultTo(parseInt(inputValue), false);
    this._changeValidationValue('minLength', value);
  };

  handleMaxLengthChange = (inputValue) => {
    const value = _.defaultTo(parseInt(inputValue), false);
    this._changeValidationValue('maxLength', value);
  };

  _changeValidationValue(type, value) {
    const { setValidationInfo, resetValidationInfo } = this.props;
    value
    ? setValidationInfo({ type, value })
    : resetValidationInfo({ type });
  }

  render() {
    const { minLengthValue, maxLengthValue } = this.props;
    return (
      <EditSection>
        <EditRow>
          <Col xs={8} sm={9}>
            <SectionTitle
              title="Minimum characters"
              popoverId="validationMinLength"
              description="(Leave empty if not required)"
            />
          </Col>
          <Col xs={4} sm={3}>
            <TextInput type="number"
              value={minLengthValue === null ? '' : minLengthValue}
              onChange={this.handleMinLengthChange} />
          </Col>
        </EditRow>
        <EditRow>
          <Col xs={8} sm={9}>
            <SectionTitle
              title="Maximum characters"
              popoverId="validationMaxLength"
              description="(Leave empty if not required)"
            />
          </Col>
          <Col xs={4} sm={3}>
            <TextInput type="number"
              value={maxLengthValue === null ? '' : maxLengthValue}
              onChange={this.handleMaxLengthChange} />
          </Col>
        </EditRow>
      </EditSection>
    );
  }
}

export default LengthValidation;
