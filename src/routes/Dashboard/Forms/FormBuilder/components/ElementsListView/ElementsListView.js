import React, {
  Component,
  PropTypes
} from 'react';
import {
  Accordion,
  Panel,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import _ from 'lodash';
import questionInputs, {
  questionInputGroups
} from 'schemas/questionInputs';
import styles from './ElementsListView.scss';

class ElementsListView extends Component {

  static propTypes = {
    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * setActiveInputName: used to set active input element selected, and enables to draw on the right
     */
    setActiveInputName: PropTypes.func.isRequired,

    /*
     * saveElement: Redux action to save the current element being edited.
     */
    saveElement: PropTypes.func.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired
  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  handleElementClick(event, inputType) {
    event.stopPropagation();
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode({
      mode: true,
      inputType
    });
  }

  renderPanelContent(elements) {
    const { activeInputName } = this.props;
    const that = this;
    return (
      <Row className={styles.panelRow}>
        {
          elements.map((element, index) => {
            return (
              <Col sm={4} className={styles.panelCol} key={index}>
                <Button block active={activeInputName === element.name}
                  onClick={function (e) { that.handleElementClick(e, element.name); }}>
                  {element.displayText}
                </Button>
              </Col>
            );
          })
        }
      </Row>
    );
  }

  render() {
    const that = this;
    var accordionItems = questionInputGroups.map((group, index) => {
      return (
        <Panel header={group.displayText} key={index} eventKey={index}>
          {that.renderPanelContent(_.filter(questionInputs, {group: group.name}))}
        </Panel>
      );
    });

    return (
      <div className={styles.elementsListView}>
        <Accordion defaultActiveKey={0}>
          {accordionItems}
        </Accordion>
      </div>
    );
  }
}

export default ElementsListView;
