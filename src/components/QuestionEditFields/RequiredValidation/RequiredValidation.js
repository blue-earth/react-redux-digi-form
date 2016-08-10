import React, {
  Component,
  PropTypes
} from 'react';

import {
  Col
} from 'react-bootstrap';
import Switch from 'rc-switch';
import _ from 'lodash';
import EditRow from '../EditRow/EditRow';
import EditSection from '../EditSection/EditSection';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './RequiredValidation.scss';

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
        <EditRow>
          <Col xs={8} sm={9}>
            <SectionTitle
              title="Mandatory"
              popoverId="isRequired" />
          </Col>
          <Col xs={4} sm={3}>
            <div className={styles.switchWrapper}>
              <Switch onChange={this.handleIsRequiredChange} checked={isRequired} />
            </div>
          </Col>
        </EditRow>
      </EditSection>
    );
  }
}

export default RequiredValidation;
