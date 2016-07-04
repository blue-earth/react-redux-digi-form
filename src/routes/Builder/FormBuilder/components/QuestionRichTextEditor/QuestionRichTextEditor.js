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
  return <span {...props} contentEditable={false} className={styles.block}>{props.children}</span>;
};

class QuestionRichTextEditor extends Component {

  constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.state = {editorState: EditorState.createEmpty()};
  }

  static propTypes = {
    /*
     * answerChoices: Answer Choices could be used when edit Question.
     */
    answerChoices: PropTypes.array.isRequired,

    /*
     * insertAnswer: Insert Answer into RichTextEditor and remove from dropdown
     */
    insertAnswer: PropTypes.func.isRequired
  };

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
  }

  handleAnswerSelect = (value) => {
    const answerBlockDecorator = new CompositeDecorator([
      {
        strategy: findAnswerEntities,
        component: AnswerSpan
      }
    ]);
    const answerEntity = Entity.create('ANSWER_BLOCK', 'IMMUTABLE', value);
    const { editorState } = this.state;
    if (editorState.getSelection().isCollapsed()) {
      var newEditorState = EditorState.createWithContent(
        Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(),
        value, null, answerEntity), answerBlockDecorator);
      this.setState({
        editorState: newEditorState
      });
    }
  }

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  render() {
    const { answerChoices } = this.props;
    return (
      <div className={styles.questionRichTextEditor}>
        <div className={styles.inputWidget}>
          <Button block>+Insert Hyperlink</Button>
        </div>
        <div className={styles.inputWidget}>
          <DropdownInput choices={answerChoices} onChange={this.handleAnswerSelect} />
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
            spellCheck />
        </div>
      </div>
    );
  }
}

export default QuestionRichTextEditor;

