import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Col,
  Form,
  FormGroup,
  Row
} from 'react-bootstrap';
import { Field } from 'redux-form';
import {
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import { ControlLabel, FormControl, renderInput, renderSelect } from '../helpers';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import styles from './MedicareCardForm.scss';

export default class MedicareCardForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    idType: PropTypes.number.isRequired,
    setIdType: PropTypes.func.isRequired,
    submitIdentity: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onLinkClick: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFail: PropTypes.func.isRequired
  };

  getPassportFields(values) {
    const body = _.merge({
      'type': identityConstants.DVSMEDICARECARD,
      'verification_data': {
        'passport': {
          'country': 'AU'
        }
      }
    }, values);
    return body;
  }

  handleIdTypeChange = (event) => {
    const { setIdType } = this.props;
    setIdType(parseInt(event.target.value, 10));
  }

  handleSubmitForm = (values) => {
    const { submitIdentity, onSuccess, onFail } = this.props;
    let body = {};
    body = this.getPassportFields(values);

    submitIdentity({
      body,
      success: onSuccess,
      fail: onFail
    });
  }

  get monthNames() {
    return [
      { value: '01', label: 'Jan' },
      { value: '02', label: 'Feb' },
      { value: '03', label: 'Mar' },
      { value: '04', label: 'Apr' },
      { value: '05', label: 'May' },
      { value: '06', label: 'Jun' },
      { value: '07', label: 'Jul' },
      { value: '08', label: 'Aug' },
      { value: '09', label: 'Sep' },
      { value: '10', label: 'Oct' },
      { value: '11', label: 'Nov' },
      { value: '12', label: 'Dec' }
    ];
  }

  render() {
    const { handleSubmit, idType, isSubmitting, onLinkClick } = this.props;
    const typeOptions = _.map(identityDocumentTypesList, (item, index) => (
      <option value={item.value} key={index}>{item.label}</option>
    ));
    const monthOptions = _.map(this.monthNames, (item, index) => (
      <option value={item.value} key={index}>{item.label}</option>
    ));
    return (
      <Form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <IDVerificationFormWrapper>
          <FormGroup>
            <ControlLabel>Identity document type</ControlLabel>
            <FormControl componentClass="select" onChange={this.handleIdTypeChange} value={idType}>
              {typeOptions}
            </FormControl>
          </FormGroup>
          <Row>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.medicare_card.number"
                type="text"
                label="Medicare Card no."
                placeholder="Passport no." />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.medicare_card.reference_number"
                type="text"
                label="Medicare reference"
                placeholder="ex. 2" />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <ControlLabel>Medicare card expire</ControlLabel>
              <Row className={styles.narrowRow}>
                <Col xs={6} className={styles.narrowCol}>
                  <Field component={renderSelect}
                    name="verification_data.medicare_card.expiry_date_month"
                    placeholder="Month">
                    {monthOptions}
                  </Field>
                </Col>
                <Col xs={6} className={styles.narrowCol}>
                  <Field component={renderInput}
                    name="verification_data.medicare_card.expiry_date_year"
                    type="text"
                    placeholder="Year" />
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Field component={renderSelect}
                name="verification_data.medicare_card.colour"
                type="text"
                label="Medicare colour"
                placeholder="Medicare Colour">
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
              </Field>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field component={renderInput}
                name="person.first_name"
                type="text"
                label="First name"
                placeholder="First name" />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="person.last_name"
                type="text"
                label="Last name"
                placeholder="Last name" />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field component={renderInput}
                name="person.date_of_birth"
                type="date"
                label="Date of birth"
                placeholder="Date of birth" />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="person.email"
                type="email"
                label="Email"
                placeholder="Email" />
            </Col>
          </Row>
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter submitting={isSubmitting} onLinkClick={onLinkClick} />
      </Form>
    );
  }
}
