import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Form } from 'react-bootstrap';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import PersonItem from './PersonItem';
import styles from './PeopleList.scss';

export default class PeopleList extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    people: PropTypes.array.isRequired,
    pendingPeople: PropTypes.array,
    verifiedPeople: PropTypes.array,
    setIDVerifyStatus: PropTypes.func.isRequired,
    onLinkClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    pendingPeople: [],
    verifiedPeople: []
  };

  handleContinue = (values) => {
    const { setIDVerifyStatus } = this.props;
    setIDVerifyStatus({
      people: values.people,
      step: 'VERIFY' // TODO: should be 'SELECT_METHOD' when this component is implemented
    });
  }

  render() {
    const { pendingPeople, verifiedPeople, handleSubmit, onLinkClick } = this.props;
    return (
      <Form className={styles.peopleList} onSubmit={handleSubmit(this.handleContinue)}>
        <IDVerificationFormWrapper>
          <h3 className={styles.headline}>
            Select all the people who are <strong>NOT</strong> currently viewing this device.
          </h3>
          <p className={styles.description}>
            You may need to send them an email to verify their ID
          </p>
          <div>
          {
            _.map(pendingPeople, (person, index) => (
              <PersonItem person={person} index={index} />
            ))
          }
          </div>
          <div>
          {
            _.map(verifiedPeople, (person, index) => (
              <PersonItem person={person} index={index} />
            ))
          }
          </div>
        </IDVerificationFormWrapper>
        <div className={styles.footerWrapper}>
          <IDVerificationFormFooter includeTerms={false} submitLabel="Continue"
            onLinkClick={onLinkClick} />
        </div>
      </Form>
    );
  }
}
