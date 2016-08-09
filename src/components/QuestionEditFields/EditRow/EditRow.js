import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row
} from 'react-bootstrap';
import styles from './EditRow.scss';

class EditRow extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired
    ])
  };

  render() {
    return (
      <Row className={styles.sectionRow}>
        {this.props.children}
      </Row>
    );
  }
}

export default EditRow;
