import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from './FormRow.scss';

class FormRow extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired
    ])
  };

  render() {
    return (
      <div className="container">
        <Row>
          <Col md={10} mdOffset={2}>
            <div className={styles.formRow}>
              {this.props.children}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FormRow;
