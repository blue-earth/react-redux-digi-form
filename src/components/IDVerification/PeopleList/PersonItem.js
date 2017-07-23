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
import classNames from 'classnames';
import StatusLabel from '../StatusLabel';
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
            <StatusLabel status={person.status} />
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
    const { person } = this.props;
    return (
      <Row>
        <Col xs={8}>
          {this.fullName}
        </Col>
        <Col xs={4} className="text-right">
          <StatusLabel status={person.status} />
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
