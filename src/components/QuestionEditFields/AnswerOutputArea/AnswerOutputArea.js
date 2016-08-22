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
import { getChoiceLabelByIndex } from 'helpers/formBuilderHelper';
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
    setMappingInfo: PropTypes.func.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    inputSchema: PropTypes.object.isRequired
  };

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
  }

  sectionIsNeeded() {
    const { inputSchema } = this.props;
    const components = ['MultipleChoice', 'DropdownField'];
    return _.includes(components, inputSchema.name);
  }

  get choices() {
    return _.get(this.props, ['currentElement', 'question', 'choices'], []);
  }

  get positions() {
    return _.get(this.props, ['currentElement', 'mappingInfo', 'positions'], []);
  }

  get finalChoices() {
    return this.includeOther ? _.concat(this.choices, [{
      label: this.newLabel,
      text: 'Other'
    }]) : this.choices;
  }

  get includeOther() {
    return _.get(this.props, ['currentElement', 'question', 'include_other'], false);
  }

  get newLabel() {
    return getChoiceLabelByIndex(this.choices.length);
  }

  get activeBoxIndex() {
    return _.get(this.props, ['currentElement', 'mappingInfo', 'activeIndex'], false);
  }

  handleDeleteSelection = (index) => {
    const { setQuestionInfo, setMappingInfo } = this.props;
    const choices = this.choices;
    const that = this;
    _.pullAt(choices, [index]);
    _.map(choices, (item, index) => { item.label = getChoiceLabelByIndex(index); });
    setQuestionInfo({ choices });

    const positions = this.positions;
    _.pullAt(positions, [index]);
    setMappingInfo({ positions });
  }

  handleReselect = (index) => {
    const { setMappingInfo } = this.props;
    const positions = this.positions;
    positions[index] = null;
    setMappingInfo({
      positions,
      activeIndex: index
    });
  }

  handleAddChoice = () => {
    const { setQuestionInfo, setMappingInfo } = this.props;
    const choices = this.choices;
    const newItem = {
      label: this.newLabel,
      text: ''
    };
    setQuestionInfo({
      choices: _.concat(choices, [newItem])
    });

    const positions = this.positions;
    const newIndex = choices.length;
    positions.splice(newIndex, 0, null);
    setMappingInfo({
      activeIndex: newIndex,
      positions
    });
  }

  handleChangeText = (index, text) => {
    const { setQuestionInfo } = this.props;
    const choices = this.choices;
    choices[index].text = text;
    setQuestionInfo({
      choices
    });
  }

  handleIncludeOther = () => {
    const { setQuestionInfo, setMappingInfo } = this.props;
    const choices = this.choices;
    const positions = this.positions;
    setQuestionInfo({
      include_other: !this.includeOther
    });
    if (this.includeOther) {
      setMappingInfo({
        activeIndex: 0,
        positions: positions.slice(0, choices.length)
      });
    } else {
      setMappingInfo({
        activeIndex: positions.length
      });
    }
  }

  handlePreviewButtonClick = (activeIndex) => {
    const { setMappingInfo } = this.props;
    setMappingInfo({ activeIndex });
  }

  renderList() {
    const choices = this.finalChoices;
    const that = this;

    const isReadonlyField = (index) => this.includeOther && index + 1 === choices.length;

    return _.map(choices, (item, index) => (
      <FormGroup key={index} className={styles.formGroup}>
        <InputGroup>
          <InputGroup.Addon className={styles.itemLabel}>
            {item.label}
          </InputGroup.Addon>
          <FormControl type="text" value={item.text}
            readOnly={isReadonlyField(index)}
            onChange={function (e) { that.handleChangeText(index, e.target.value); }} />
        </InputGroup>
        <ul className={styles.actionItems}>
          <li>
            <OverlayTrigger trigger={['hover', 'focus']} overlay={this.getPopover('reselectOutputArea')}>
              <Button className={`${styles.actionButton} ${styles.reselectButton}`}
                onClick={function (e) { that.handleReselect(index); }}
              >
                <MdCropFree size={18} />
              </Button>
            </OverlayTrigger>
          </li>
          <li>
            {!isReadonlyField(index) &&
              <Button className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={function (e) { that.handleDeleteSelection(index); }}
              >
                <span className={styles.removeLabel}>Remove?</span>
                <MdDelete size={18} />
              </Button>
            }
          </li>
        </ul>
      </FormGroup>
    ));
  }

  renderAddButton() {
    return (
      <Button block className={styles.addButton}
        onClick={this.handleAddChoice}
      >
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
          <Switch onChange={this.handleIncludeOther} checked={this.includeOther} />
        </div>
      </div>
    );
  }

  renderPreviewAnswerOutput() {
    const choices = this.finalChoices;
    const that = this;
    return (
      <ul className={styles.previewItems}>
        {
          _.map(choices, (item, index) => (
            <li key={index}>
              <Button onClick={function (e) { that.handlePreviewButtonClick(index); }}
                className={styles.previewItemButton}
                active={that.activeBoxIndex === index}
              >
                {item.label}
              </Button>
            </li>
          ))
        }
      </ul>
    );
  }

  render() {
    if (!this.sectionIsNeeded()) return false;
    return (
      <div>
        <EditSection>
          <SectionTitle
            title="Answer output area(s)"
            popoverId="outputArea"
          />
          {this.renderList()}
          {this.renderAddButton()}
          {this.renderAllowOtherOption()}
        </EditSection>
        <EditSection>
          <SectionTitle
            title="Preview answer output"
            description="Select one answer to preview"
            popoverId="previewAnswerOutput"
          />
          {this.renderPreviewAnswerOutput()}
        </EditSection>
      </div>
    );
  }
}

export default AnswerOutputArea;
