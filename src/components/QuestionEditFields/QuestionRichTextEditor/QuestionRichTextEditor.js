import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Dropdown,
  MenuItem
} from 'react-bootstrap';
import {
  Modifier,
  Editor,
  EditorState,
  RichUtils,
  Entity,
  CompositeDecorator
} from 'draft-js';
import classNames from 'classnames';
import {
  MdKeyboardArrowDown
} from 'react-icons/lib/md';
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

  static propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    const answerBlockDecorator = new CompositeDecorator([
      {
        strategy: findAnswerEntities,
        component: AnswerSpan
      }
    ]);
    const { value } = this.props;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    const initialEditorState = EditorState.createEmpty(answerBlockDecorator);
    const initialContentState = Modifier.insertText(initialEditorState.getCurrentContent(),
      initialEditorState.getSelection(), value);
    this.state = {editorState: EditorState.createWithContent(initialContentState)};
  }

  componentWillReceiveProps(nextProps) {
    const answerBlockDecorator = new CompositeDecorator([
      {
        strategy: findAnswerEntities,
        component: AnswerSpan
      }
    ]);
    const { value } = nextProps;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    const initialEditorState = EditorState.createEmpty(answerBlockDecorator);
    const initialContentState = Modifier.insertText(initialEditorState.getCurrentContent(),
      initialEditorState.getSelection(), value);
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

  handleValueChange = (editorState) => {
    this.setState({editorState});
    const { setValue } = this.props;
    setValue(editorState.getCurrentContent().getPlainText());
  }

  handleInsertHyperLink = () => {
    const { editorState } = this.state;
    console.log(editorState.getCurrentContent().getBlockMap());
  }

  handleAnswerSelect = (value) => {
    console.log(value);
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
    this.handleValueChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicClick = () => {
    this.handleValueChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  showOffset = () => {
    const { editorState } = this.state;
    console.log(editorState.getSelection().anchorOffset, editorState.getSelection().focusOffset);
    console.log(editorState.getSelection().anchorKey, editorState.getSelection().focusKey);
  }

  renderToolbar() {
    return (
      <div className={styles.toolbar}>
        <div className={styles.inputWidget}>
          <Button block bsSize="xsmall" onClick={this.handleInsertHyperLink}>+ Insert Hyperlink</Button>
        </div>
        <div className={styles.inputWidget}>
          {this.renderAnswerDropdown()}
        </div>
        <div className={styles.styleWidget}>
          <Button bsSize="xsmall"
            className={`${styles.squareButton} pull-left`}
            onClick={this.onBoldClick}>
            <b>B</b>
          </Button>
          <Button bsSize="xsmall"
            className={`${styles.squareButton} pull-right`}
            onClick={this.onItalicClick}>
            <i>I</i>
          </Button>
        </div>
      </div>
    );
  }

  renderAnswerDropdown() {
    const { questions } = this.props;
    const buttonClass = classNames({
      [styles.dropdownAnswerButton]: true,
      'btn btn-xs btn-default': true
    });
    return (
      <Dropdown
        id="QRT_AnswersDropdown"
        className={styles.answersDropdown}
        onSelect={this.handleAnswerSelect}>
        <Button bsRole="toggle" block
          className={buttonClass}>
          + Insert Answer
          <span className="pull-right">
            <MdKeyboardArrowDown size={16} />
          </span>
        </Button>
        <Dropdown.Menu>
          {questions.length > 0
            ? questions.map(item => (
              <MenuItem key={`{{${item.key}}}`} eventKey={`{{${item.key}}}`}>{item.text}</MenuItem>
            ))
            : <MenuItem disabled>No questions available</MenuItem>
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    return (
      <div className={styles.questionRichTextEditor}>
        {this.renderToolbar()}
        <div className={styles.editWidget}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.handleValueChange}
            spellCheck />
        </div>
      </div>
    );
  }
}

export default QuestionRichTextEditor;

