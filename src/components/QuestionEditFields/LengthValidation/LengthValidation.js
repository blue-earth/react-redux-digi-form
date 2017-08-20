import React, {
  Component,
  PropTypes
} from 'react';

import {
  Col,
  FormControl
} from 'react-bootstrap';
import _ from 'lodash';
import EditRow from '../EditRow';
import EditSection from '../EditSection';
import SectionTitle from '../SectionTitle';
import styles from './LengthValidation.scss';

class LengthValidation extends Component {
  static propTypes = {
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    minLengthValue: PropTypes.number,
    maxLengthValue: PropTypes.number
  };

  static defaultProps = {
    minLengthValue: null,
    maxLengthValue: null
  };

  handleMinLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this._changeValidationValue('minLength', value);
  };

  handleMaxLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
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
            <FormControl type="number" className={styles.textInput}
              value={minLengthValue}
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
            <FormControl type="number" className={styles.textInput}
              value={maxLengthValue}
              onChange={this.handleMaxLengthChange} />
          </Col>
        </EditRow>
      </EditSection>
    );
  }
}

export default LengthValidation;
