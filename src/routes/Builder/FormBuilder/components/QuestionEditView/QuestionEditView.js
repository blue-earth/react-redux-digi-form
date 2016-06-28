import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import { Button } from 'react-bootstrap';
import styles from './QuestionEditView.scss';

class QuestionEditView extends Component {
  
  static propTypes = {
    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,
    
    /*
     * deleteElement: used to set active input element selected, and enables to draw on the right
     */
    deleteElement: PropTypes.func.isRequired,

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
  
  handlePreview = () => {

  }

  handleDelete = () => {
    const { deleteElement, currentQuestionId } = this.props;
    deleteElement(currentQuestionId);
  }

  handleReset = () => {

  }

  handleCancel = () => {
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode(false);
  }

  handleSave = () => {

  }

  renderTopActionButtons() {
    return (
      <div className={styles.topActionButtons}>
        <Button bsStyle="link" onClick={this.handlePreview}>Preview</Button>
        <Button bsStyle="link" onClick={this.handleDelete}>Delete</Button>
        <Button bsStyle="link" onClick={this.handleReset}>Reset</Button>
        <Button bsStyle="link" onClick={this.handleCancel}>Cancel</Button>
        <Button bsStyle="link" onClick={this.handleSave}>Save</Button>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.questionEditView}>
        {this.renderTopActionButtons()}
        {'Question Edit View'}
      </div>
    )
  }
}

export default QuestionEditView;
