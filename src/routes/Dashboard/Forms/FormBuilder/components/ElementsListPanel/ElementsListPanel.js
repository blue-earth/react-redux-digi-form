import React, {
  Component,
  PropTypes
} from 'react';
import {
  Panel,
  Row,
  Col,
  Collapse
} from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/lib/fa';
import SelectButton from 'components/Buttons/SelectButton';
import Icon from 'components/Icon';
import _ from 'lodash';
import classNames from 'classnames';
import questionInputs, {
  questionInputGroups
} from 'schemas/questionInputs';
import styles from './ElementsListPanel.scss';
import { formBuilderSelectMode } from 'constants/formBuilder';
import { createEmptyQuestionElement } from 'helpers/formBuilderHelper';

export default class ElementsListPanel extends Component {

  static propTypes = {
    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,
    /**
     * Set current Element
     */
    setCurrentEditingQuestion: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      panels: {
        0: true   // 0 is the index, true means the panel is opened
      }
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  createEmptyQuestion = (questionTypeName, boxMappingType=null) => {
    const {
      setQuestionEditMode,
      setCurrentEditingQuestion
    } = this.props;
    // 1. Create empty question object based on questionTypeName
    const newQuestion = createEmptyQuestionElement(questionTypeName, boxMappingType);
    // 2. Set current element to this new question object
    setCurrentEditingQuestion(newQuestion);
    // 3. Enter box mapping mode (Hide left side bar)
    setQuestionEditMode(formBuilderSelectMode.QUESTION_BOX_MAPPING_VIEW);
  };

  handleQuestionTypePanelClick = (key) => {
    const { panels } = this.state;
    const newValue = !_.defaultTo(panels[key], false);
    this.setState({
      panels: Object.assign({}, panels, { [key]: newValue })
    });
  };

  handleElementClick(event, inputType) {
    // handle the creation of question type with no drop down options
    // such as fileupload
    event.stopPropagation();
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode(formBuilderSelectMode.QUESTION_BOX_MAPPING_VIEW);
    // todo: change InputType
    // todo: change box mapping type
  }

  handleElementOptClick = (key) => {
    var splitKey = key.split('|');
    // todo: refactor this "|" hack
    var inputType = splitKey[0];
    var selectionType = splitKey[1];
    this.createEmptyQuestion(inputType, selectionType);
  };

  renderPanelContent(elements) {
    const that = this;
    return (
      <Row className={styles.panelRow}>
        {
          elements.map((element, index) => {
            var opts = [];
            if (element.selectionTypes.length) {
              var elementName = element.name;
              _.forEach(element.selectionTypes, function (selectionType) {
                var selectionTypeLabel = selectionType;
                var selectionTypeKey = elementName + '|' + selectionType;
                if (selectionType === 'standard') {
                  selectionTypeLabel = (<span>
                    <span className={styles.svgWrapper}>
                      <Icon name="StandardInput" />
                    </span>
                  Standard style</span>);
                }
                if (selectionType === 'block') {
                  selectionTypeLabel = (<span>
                    <span className={styles.svgWrapper}>
                      <Icon name="BlockInput" />
                    </span>
                  Block style</span>);
                }
                opts.push({'label': selectionTypeLabel, 'value': selectionType, 'key': selectionTypeKey});
              });
            }
            return (
              <Col xs={6} className={styles.panelCol} key={index}>
                <SelectButton
                  className={styles.inputType}
                  label={<span className={styles.svgWrapper}>
                    {element.displayIcon && <Icon name={element.displayIcon} />}
                    {element.displayText}
                  </span>}
                  optionsList={opts}
                  onClick={function (e) { that.handleElementClick(e, element.name); }}
                  onChange={that.handleElementOptClick} />
              </Col>
            );
          })
        }
      </Row>
    );
  }

  render() {
    const that = this;
    var panelItems = questionInputGroups.map((group, index) => {
      const expanded = _.defaultTo(this.state.panels[index], false);
      const headerClass = classNames({
        [styles.panelHeader]: true,
        [styles.expanded]: expanded
      });
      return (
        <div key={index} className={styles.panelWrapper}>
          <div className={headerClass} onClick={function () { that.handleQuestionTypePanelClick(index); }}>
            {group.displayText}
            <span className={styles.headerArrow}><FaChevronDown size={12} /></span>
          </div>
          <Collapse in={expanded}>
            <Panel eventKey={index} className={styles.panel}>
              {that.renderPanelContent(_.filter(questionInputs, {group: group.name}))}
            </Panel>
          </Collapse>
        </div>
      );
    });

    return (
      <div className={styles.elementsListView}>
        <div className={styles.elementsListViewInner}>
          {panelItems}
        </div>
      </div>
    );
  }
}
