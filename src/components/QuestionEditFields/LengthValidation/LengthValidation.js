import React, {
  Component,
  PropTypes
} from 'react';

import {
  Col,
  FormControl
} from 'react-bootstrap';
import _ from 'lodash';
import EditRow from '../EditRow/EditRow';
import EditSection from '../EditSection/EditSection';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './LengthValidation.scss';

class LengthValidation extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    inputSchema: PropTypes.object.isRequired
  };

  handleMinLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('minLength', value);
  }

  handleMaxLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('maxLength', value);
  }

  changeValidationValue(type, value) {
    const { setValidationInfo, resetValidationInfo } = this.props;
    value
    ? setValidationInfo({ type, value })
    : resetValidationInfo({ type });
  }

  render() {
    const { inputSchema } = this.props;
    const minLengthNeeded = _.includes(inputSchema.validations, 'min_length');
    const maxLengthNeeded = _.includes(inputSchema.validations, 'max_length');
    if (!minLengthNeeded && !maxLengthNeeded) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const minLength = _.defaultTo(_.find(validations, { type: 'minLength' }), { value: '' });
    const maxLength = _.defaultTo(_.find(validations, { type: 'maxLength' }), { value: '' });
    return (
      <EditSection>
        {minLengthNeeded &&
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
                value={minLength.value}
                onChange={this.handleMinLengthChange} />
            </Col>
          </EditRow>
        }
        {maxLengthNeeded &&
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
                value={maxLength.value}
                onChange={this.handleMaxLengthChange} />
            </Col>
          </EditRow>
        }
      </EditSection>
    );
  }
}

export default LengthValidation;
