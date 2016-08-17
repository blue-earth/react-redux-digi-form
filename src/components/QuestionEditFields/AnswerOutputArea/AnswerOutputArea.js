import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import Switch from 'rc-switch';
import popoverTexts from 'schemas/popoverTexts';
import {
  MdCropFree,
  MdDelete
} from 'react-icons/lib/md';
import EditSection from '../EditSection/EditSection';
import SectionTitle from '../SectionTitle/SectionTitle';
import _ from 'lodash';
import styles from './AnswerOutputArea.scss';

class AnswerOutputArea extends Component {
  static propTypes = {
    resetMappingInfo: PropTypes.func.isRequired
  };

  handleDeleteSelection = (event) => {
    const { resetMappingInfo } = this.props;
    resetMappingInfo();
  }

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
  }

  getLabelByIndex(index) {
    return String.fromCharCode('A'.charCodeAt(0) + index);
  }

  renderList() {
    return _.map([1, 2, 3], (item, index) => {
      return (
        <FormGroup key={index} className={styles.formGroup}>
          <InputGroup>
            <InputGroup.Addon className={styles.itemLabel}>
              {this.getLabelByIndex(index)}
            </InputGroup.Addon>
            <FormControl type="text" />
          </InputGroup>
          <ul className={styles.actionItems}>
            <li>
              <OverlayTrigger trigger="hover" overlay={this.getPopover('reselectOutputArea')}>
                <Button className={styles.actionButton} onClick={this.handleDeleteSelection}>
                  <MdCropFree size={18} />
                </Button>
              </OverlayTrigger>
            </li>
            <li>
              <Button className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={this.handleDeleteSelection}
              >
                <span className={styles.removeLabel}>Remove?</span>
                <MdDelete size={18} />
              </Button>
            </li>
          </ul>
        </FormGroup>
      );
    });
  }

  renderAddButton() {
    return (
      <Button block className={styles.addButton}>
        + Add new answer output area
      </Button>
    );
  }

  renderAllowOtherOption() {
    return (
      <div className={styles.otherOption}>
        <div className={styles.otherOptionLeft}>
          <SectionTitle title={'Allow "Other" option'} />
        </div>
        <div className={styles.otherOptionRight}>
          <Switch />
        </div>
      </div>
    );
  }

  render() {
    return (
      <EditSection>
        <SectionTitle
          title="Answer output area(s)"
          popoverId="outputArea"
        />
        {this.renderList()}
        {this.renderAddButton()}
        {this.renderAllowOtherOption()}
      </EditSection>
    );
  }
}

export default AnswerOutputArea;
