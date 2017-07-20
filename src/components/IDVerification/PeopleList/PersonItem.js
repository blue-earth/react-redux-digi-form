import React, { Component, PropTypes } from 'react';
import {
  Col,
  Collapse,
  Row
} from 'react-bootstrap';
import { Field } from 'redux-form';
import {
  renderInput,
  renderCheckbox
} from '../helpers';
import { MdInfo, MdCheckCircle } from 'react-icons/lib/md';
import classNames from 'classnames';
import styles from './PeopleList.scss';

export default class PersonItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    person: PropTypes.object.isRequired
  };

  get fullName() {
    const { person } = this.props;
    return `${person.first_name} ${person.last_name}`;
  }

  renderStatusSuccess() {
    return (
      <span>
        <MdCheckCircle className={styles.successIcon} size={18} />
        <span className={styles.statusText}>Verified</span>
      </span>
    );
  }

  renderStatusWarning() {
    return (
      <span>
        <MdInfo className={styles.warningIcon} size={18} />
        <span className={styles.statusText}>Pending</span>
      </span>
    );
  }

  renderPendingField() {
    const { person, index } = this.props;
    return (
      <div>
        <Row>
          <Col xs={8}>
            <Field component={renderCheckbox} type="checkbox"
              label={this.fullName}
              inline
              name={`people[${index}].selected`} />
          </Col>
          <Col xs={4} className="text-right">
            {this.renderStatusWarning()}
          </Col>
        </Row>
        <Collapse in={person.selected}>
          <div className={styles.emailField}>
            <Field component={renderInput}
              name={`people[${index}].email`}
              type="text"
              label="Email address"
              placeholder="Email address" />
          </div>
        </Collapse>
      </div>
    );
  }

  renderVerifiedField() {
    return (
      <Row>
        <Col xs={8}>
          {this.fullName}
        </Col>
        <Col xs={4} className="text-right">
          {this.renderStatusSuccess()}
        </Col>
      </Row>
    );
  }

  render() {
    const { person } = this.props;
    const wrapperClass = classNames(styles.personItem, {
      [styles.verified]: person.status !== 'PENDING'
    });
    return (
      <div className={wrapperClass}>
        {person.status === 'PENDING'
          ? this.renderPendingField()
          : this.renderVerifiedField()
        }
      </div>
    );
  }
}
