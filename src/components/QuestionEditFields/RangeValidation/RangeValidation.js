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

class RangeValidation extends Component {
  static propTypes = {
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    minRangeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])]),
    maxRangeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])])
  };

  handleMinimumChange = (inputValue) => {
    const value = _.defaultTo(parseInt(inputValue), false);
    this._changeValidationValue('minimum', value);
  }

  handleMaximumChange = (inputValue) => {
    const value = _.defaultTo(parseInt(inputValue), false);
    this._changeValidationValue('maximum', value);
  }

  _changeValidationValue(type, value) {
    const { setValidationInfo, resetValidationInfo } = this.props;
    value
    ? setValidationInfo({ type, value })
    : resetValidationInfo({ type });
  }

  render() {
    const { minRangeValue, maxRangeValue } = this.props;
    return (
      <EditSection>
        <EditRow>
          <Col xs={8} sm={9}>
            <SectionTitle
              title="Minimum value"
              popoverId="validationMinimum"
              description="(Leave empty if not required)"
            />
          </Col>
          <Col xs={4} sm={3}>
            <TextInput type="number"
              value={minRangeValue === null ? '' : minRangeValue}
              onChange={this.handleMinimumChange} />
          </Col>
        </EditRow>
        <EditRow>
          <Col xs={8} sm={9}>
            <SectionTitle
              title="Maximum value"
              popoverId="validationMaximum"
              description="(Leave empty if not required)"
            />
          </Col>
          <Col xs={4} sm={3}>
            <TextInput type="number"
              value={maxRangeValue === null ? '' : maxRangeValue}
              onChange={this.handleMaximumChange} />
          </Col>
        </EditRow>
      </EditSection>
    );
  }
}

export default RangeValidation;
