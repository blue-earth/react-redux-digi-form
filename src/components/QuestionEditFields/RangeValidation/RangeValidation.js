import React, {
  Component,
  PropTypes
} from 'react';

import {
  Col
} from 'react-bootstrap';
import _ from 'lodash';
import EditRow from '../EditRow/EditRow';
import EditSection from '../EditSection/EditSection';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './RangeValidation.scss';

class RangeValidation extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    inputSchema: PropTypes.object.isRequired
  };

  handleMinimumChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('minimum', value);
  }

  handleMaximumChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('maximum', value);
  }

  changeValidationValue(type, value) {
    const { setValidationInfo, resetValidationInfo } = this.props;
    value
    ? setValidationInfo({ type, value })
    : resetValidationInfo({ type });
  }

  render() {
    const { inputSchema } = this.props;
    const minimumNeeded = _.includes(inputSchema.validations, 'minimum');
    const maximumNeeded = _.includes(inputSchema.validations, 'maximum');
    if (!minimumNeeded && !maximumNeeded) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const minimum = _.defaultTo(_.find(validations, { type: 'minimum' }), { value: '' });
    const maximum = _.defaultTo(_.find(validations, { type: 'maximum' }), { value: '' });
    return (
      <EditSection>
        {minimumNeeded &&
          <EditRow>
            <Col xs={8} sm={9}>
              <SectionTitle
                title="Minimum value"
                popoverId="validationMinimum"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={minimum.value}
                onChange={this.handleMinimumChange} />
            </Col>
          </EditRow>
        }
        {maximumNeeded &&
          <EditRow>
            <Col xs={8} sm={9}>
              <SectionTitle
                title="Maximum value"
                popoverId="validationMaximum"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={maximum.value}
                onChange={this.handleMaximumChange} />
            </Col>
          </EditRow>
        }
      </EditSection>
    );
  }
}

export default RangeValidation;
