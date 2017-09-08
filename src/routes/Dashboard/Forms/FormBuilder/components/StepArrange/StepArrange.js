import React, {
  Component,
  PropTypes
} from 'react';
import {
  Col,
  Panel,
  Row
} from 'react-bootstrap';
import classNames from 'classnames';
// import SortableTree from 'react-sortable-tree';
import { propsChanged } from 'helpers/pureFunctions';
import { getTreeDataFromQuestions, getQuestionsFromTreeData } from 'helpers/formBuilderHelper';
import AppButton from 'components/Buttons/AppButton';
import styles from './StepArrange.scss';
import QuestionsTree from 'components/QuestionsTree';

export default class StepArrange extends Component {
  static propTypes = {
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,

    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

    /*
     * logics: Redux state to store the array of logics.
     */
    logics: PropTypes.array.isRequired,

    /*
     * addNewGroup: Redux action to add a new group to questions.
     */
    addNewGroup: PropTypes.func.isRequired,

    /*
     * setBuilderState: Redux action to change any field formBuilderState.
     */
    setBuilderState: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return propsChanged(['questions'], this.props, nextProps);
  }

  handleTreeChange = (treeData) => {
    const { setBuilderState } = this.props;
    setBuilderState({ questions: getQuestionsFromTreeData(treeData) });
  }

  handleNewSection = () => {
    const { addNewGroup } = this.props;
    addNewGroup();
  }

  renderNode(node) {
    return (
      <div className={styles.node}>
        {node.title}
      </div>
    );
  }

  render() {
    const { questions } = this.props;
    const treeData = getTreeDataFromQuestions(questions);
    return (
      <div className={classNames(styles.panelWrapper, 'container')}>
        <div className={styles.panelHeader}>
          <Row>
            <Col xs={6}>
              <AppButton type="secondary" onClick={this.handleNewSection}>
                New Section
              </AppButton>
            </Col>
            <Col xs={6} className={styles.rightActions}>
              <AppButton type="secondary">View logic maps</AppButton>
              <AppButton>Save & continue</AppButton>
            </Col>
          </Row>
        </div>
        <Panel className={styles.panel}>
          <QuestionsTree
            paddingLeft={20}
            tree={treeData}
            onChange={this.handleTreeChange}
            renderNode={this.renderNode}
          />
        </Panel>
      </div>
    );
  }
}
