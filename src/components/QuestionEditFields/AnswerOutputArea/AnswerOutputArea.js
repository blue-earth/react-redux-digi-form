import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Col
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/lib/fa';
import EditSection from '../EditSection/EditSection';
import EditRow from '../EditRow/EditRow';
import SectionTitle from '../SectionTitle/SectionTitle';

class AnswerOutputArea extends Component {
  static propTypes = {
    resetMappingInfo: PropTypes.func.isRequired
  };

  handleDeleteSelection = (event) => {
    const { resetMappingInfo } = this.props;
    resetMappingInfo();
  }

  render() {
    return (
      <EditSection>
        <EditRow>
          <Col xs={6}>
            <SectionTitle
              title="Answer output area(s)"
              popoverId="outputArea"
              description="(Leave empty if not required)"
            />
          </Col>
          <Col xs={6} className="text-right">
            <Button bsSize="small" onClick={this.handleDeleteSelection}>
              <FaTrash />
            </Button>
          </Col>
        </EditRow>
      </EditSection>
    );
  }
}

export default AnswerOutputArea;
