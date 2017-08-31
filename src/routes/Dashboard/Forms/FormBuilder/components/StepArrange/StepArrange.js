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
import SortableTree from 'react-sortable-tree';
import { getTreeDataFromQuestions } from 'helpers/formBuilderHelper';
import AppButton from 'components/Buttons/AppButton';
import styles from './StepArrange.scss';

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
     * setQuestionInfo: Redux action to add or update a specific item into current question.
     */
    setQuestionInfo: PropTypes.func.isRequired,

    /*
     * resetQuestionInfo: Redux action to remove a specific item into current question.
     */
    resetQuestionInfo: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      treeData: getTreeDataFromQuestions(props.questions)
    };
  }

  handleTreeChange = (treeData) => {
    this.setState({ treeData });
  }

  render() {
    const { treeData } = this.state;

    return (
      <div className={classNames(styles.panelWrapper, 'container')}>
        <div className={styles.panelHeader}>
          <Row>
            <Col xs={6}>New Section</Col>
            <Col xs={6} className={styles.rightActions}>
              <AppButton type="secondary">View logic maps</AppButton>
              <AppButton>Save & continue</AppButton>
            </Col>
          </Row>
        </div>
        <Panel className={styles.panel}>
          <SortableTree
            treeData={treeData}
            maxDepth={2}
            onChange={this.handleTreeChange}
          />
        </Panel>
      </div>
    );
  }
}
