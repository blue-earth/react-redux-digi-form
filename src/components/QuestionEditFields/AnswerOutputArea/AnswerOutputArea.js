import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  Popover
} from 'react-bootstrap';
import {
  getActiveLabel,
  getChoiceLabelByIndex
} from 'helpers/formBuilderHelper';
import popoverTexts from 'schemas/popoverTexts';
import {
  MdDelete
} from 'react-icons/lib/md';
import EditSection from '../EditSection';
import SectionTitle from '../SectionTitle';
import SwitchRow from '../SwitchRow';
import _ from 'lodash';
import styles from './AnswerOutputArea.scss';

class AnswerOutputArea extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    title: PropTypes.string,
    setMappingInfo: PropTypes.func.isRequired,
    resetMappingInfo: PropTypes.func.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    /*
     * setActiveBox: Redux action to set activeBoxPath path.
     */
    setActiveBox: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: 'Answer output area(s)'
  }

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
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
    const { activeBoxPath } = this.props.currentElement;
    const choices = this.choices;
    const label = getActiveLabel(activeBoxPath);
    if (label === 'other') {
      return choices.length;
    } else {
      return _.findIndex(choices, function (o) { return o.label === label; });
    }
  }

  handleDeleteSelection = (choiceIndex) => {
    const { setQuestionInfo, resetMappingInfo, setActiveBox } = this.props;
    const choices = this.choices;
    var oldMappingInfo = this.props.currentElement.mappingInfo;
    const deleteKey = choices[choiceIndex].label;
    delete oldMappingInfo[deleteKey];
    var newMappingInfo = {};
    _.pullAt(choices, [choiceIndex]);
    _.map(choices, (item, index) => {
      var oldLabel = item.label;
      var newLabel = getChoiceLabelByIndex(index);
      newMappingInfo[newLabel] = oldMappingInfo[oldLabel];
      item.label = newLabel;
    });
    if (this.includeOther) {
      newMappingInfo['other'] = oldMappingInfo['other'];
    }
    resetMappingInfo(newMappingInfo);
    setQuestionInfo({ choices });
    setActiveBox(null);
  }

  handleAddChoice = () => {
    const { setQuestionInfo, setMappingInfo, setActiveBox } = this.props;
    const choices = this.choices;
    const newItem = {
      label: this.newLabel,
      text: ''
    };
    var newMappingInfo = this.props.currentElement.mappingInfo;
    var newMappingItem = {[newItem.label]: {'positions': {}, 'type': 'STANDARD'}};
    setMappingInfo(Object.assign({}, newMappingInfo, newMappingItem));
    setQuestionInfo({
      choices: _.concat(choices, [newItem])
    });
    setActiveBox(_.join([newItem.label, 'positions', 0], '.'));
  }

  handleChangeText = (index, text) => {
    const { setQuestionInfo } = this.props;
    const choices = this.choices;
    choices[index].text = text;
    setQuestionInfo({
      choices
    });
  }

  handleIncludeOther = (isOn) => {
    const { setQuestionInfo, setMappingInfo, resetMappingInfo, setActiveBox } = this.props;
    setQuestionInfo({
      include_other: !this.includeOther
    });
    var newMappingInfo = this.props.currentElement.mappingInfo;
    if (isOn) {
      var newMappingItem = {'other': {'positions': {}, 'type': 'STANDARD'}};
      setMappingInfo(Object.assign({}, newMappingInfo, newMappingItem));
      setActiveBox(_.join(['other', 'positions', 0], '.'));
    } else {
      delete newMappingInfo['other'];
      resetMappingInfo(newMappingInfo);
      setActiveBox(null);
    }
  }

  handlePreviewButtonClick = (activeIndex) => {
    // TODO: this function
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

  render() {
    return (
      <div>
        <EditSection>
          <SectionTitle
            title={this.props.title}
            popoverId="outputArea"
          />
          {this.renderList()}
          <Button block className={styles.addButton} onClick={this.handleAddChoice}>
            + Add new answer output area
          </Button>
          <SwitchRow className={styles.otherOption}
            title={'Allow "Other" option'}
            onChange={this.handleIncludeOther}
            checked={this.includeOther} />
        </EditSection>
      </div>
    );
  }
}

export default AnswerOutputArea;
