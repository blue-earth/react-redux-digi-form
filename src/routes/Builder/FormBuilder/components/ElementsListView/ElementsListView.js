import React, {
  Component,
  PropTypes
} from 'react';
import {
  Accordion,
  Panel,
  Row,
  Col,
  Button,
  ButtonToolbar,
  Dropdown,
  MenuItem,
  Glyphicon
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
    setActiveInputName: PropTypes.func.isRequired
  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  handleElementClick(event, inputName) {
    event.stopPropagation();
    const { setActiveInputName } = this.props;
    setActiveInputName(inputName);
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
        <ButtonToolbar>
          <Dropdown id="dropdown-custom-1">
            <Dropdown.Toggle>
              <Glyphicon glyph="star" />
              Pow! Zoom!
            </Dropdown.Toggle>
            <Dropdown.Menu className="super-colors">
              <MenuItem eventKey="1">Action</MenuItem>
              <MenuItem eventKey="2">Another action</MenuItem>
              <MenuItem eventKey="3" active>Active Item</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4">Separated link</MenuItem>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown id="dropdown-custom-2">
            <Button bsStyle="info">
              mix it up style-wise
            </Button>
            <Dropdown.Toggle bsStyle="success"/>
            <Dropdown.Menu className="super-colors">
              <MenuItem eventKey="1">Action</MenuItem>
              <MenuItem eventKey="2">Another action</MenuItem>
              <MenuItem eventKey="3" active className="test">
                <div><i>Active</i> Item</div>
              </MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4">Separated link</MenuItem>
            </Dropdown.Menu>
          </Dropdown>

        </ButtonToolbar>
      </div>
    );
  }
}

export default ElementsListView;