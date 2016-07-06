import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import {Modifier, Editor, EditorState, RichUtils, Entity, CompositeDecorator} from 'draft-js';
import DropdownInput from 'components/QuestionInputs/DropdownInput/DropdownInput';
import styles from './QuestionRichTextEditor.scss';

function findAnswerEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'ANSWER_BLOCK'
      );
    },
    callback
  );
}

const AnswerSpan = (props) => {
  return <span {...props} contentEditable={false} className={styles.block}>{props.children}</span>; // eslint-disable-line
};

class QuestionRichTextEditor extends Component {

  constructor(props) {
    super(props);
    const answerBlockDecorator = new CompositeDecorator([
      {
        strategy: findAnswerEntities,
        component: AnswerSpan
      }
    ]);
    const { currentQuestionInstruction } = this.props;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    const initialEditorState = EditorState.createEmpty(answerBlockDecorator);
    const initialContentState = Modifier.insertText(initialEditorState.getCurrentContent(),
      initialEditorState.getSelection(), currentQuestionInstruction);
    this.state = {editorState: EditorState.createWithContent(initialContentState)};
  }

  static propTypes = {
    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

    /*
     * currentQuestionInstruction: Redux state to specify the active input instruction.
     */
    currentQuestionInstruction: PropTypes.string.isRequired,

    /*
     * setCurrentQuestionInstruction: Action to set instruction of active input element selected
     */
    setCurrentQuestionInstruction: PropTypes.func.isRequired

  };

  componentWillReceiveProps(nextProps) {
    const answerBlockDecorator = new CompositeDecorator([
      {
        strategy: findAnswerEntities,
        component: AnswerSpan
      }
    ]);
    const { currentQuestionInstruction } = nextProps;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    const initialEditorState = EditorState.createEmpty(answerBlockDecorator);
    const initialContentState = Modifier.insertText(initialEditorState.getCurrentContent(),
      initialEditorState.getSelection(), currentQuestionInstruction);
    this.state = {editorState: EditorState.createWithContent(initialContentState)};
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  onChange = (editorState) => {
    this.setState({editorState});
    const { setCurrentQuestionInstruction } = this.props;
    setCurrentQuestionInstruction(editorState.getCurrentContent().getPlainText());
    // console.log(editorState.getCurrentContent().getPlainText());
  }

  handleAnswerSelect = (value) => {
    const { editorState } = this.state;
    const prevFocusOffset = editorState.getSelection().focusOffset;
    const prevAnchorOffset = editorState.getSelection().anchorOffset;
    const answerEntity = Entity.create('ANSWER_BLOCK', 'IMMUTABLE');
    var newContent = null;
    var nextCursorPos = null;
    if (editorState.getSelection().isCollapsed()) {
      newContent = Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(),
        value, null, answerEntity);
      nextCursorPos = editorState.getSelection().merge({
        anchorOffset: prevAnchorOffset + value.length,
        focusOffset: prevFocusOffset + value.length,
        hasFocus: true
      });
    } else {
      newContent = Modifier.replaceText(editorState.getCurrentContent(), editorState.getSelection(),
        value, null, answerEntity);
      nextCursorPos = editorState.getSelection().merge({
        anchorOffset: prevAnchorOffset + value.length,
        focusOffset: prevAnchorOffset + value.length,
        hasFocus: true
      });
    }
    newContent = Modifier.insertText(newContent, nextCursorPos, ' ');
    const newEditorState = EditorState.push(editorState, newContent, 'apply-entity');
    this.setState({
      editorState: newEditorState
    });
  }

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  showOffset = () => {
    const { editorState } = this.state;
    console.log(editorState.getSelection().anchorOffset, editorState.getSelection().focusOffset);
    console.log(editorState.getSelection().anchorKey, editorState.getSelection().focusKey);
  }

  showValue = () => {
    const { editorState } = this.state;
    console.log(editorState.getCurrentContent().getBlockMap());
  }

  render() {
    console.log('render');
    return (
      <div className={styles.questionRichTextEditor}>
        <div className={styles.inputWidget}>
          <Button block onClick={this.showValue}>+Insert Hyperlink</Button>
        </div>
        <div className={styles.inputWidget}>
          <DropdownInput onChange={this.handleAnswerSelect} />
        </div>
        <div className={styles.styleWidget}>
          <Button block onClick={this.onBoldClick}><b>B</b></Button>
          <Button block onClick={this.onItalicClick}><i>I</i></Button>
        </div>
        <div className={styles.editWidget}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck />
        </div>
      </div>
    );
  }
}

export default QuestionRichTextEditor;

