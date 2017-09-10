import React, {
  Component,
  PropTypes
} from 'react';
import {
  MdDelete,
  MdDone,
  MdEdit
} from 'react-icons/lib/md';
import {
  Button,
  FormGroup,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import classNames from 'classnames';
import DeleteGroupFailureModal from '../DeleteGroupFailureModal';
import styles from './GroupNode.scss';

export default class GroupNode extends Component {
  static propTypes = {
    deleteGroup: PropTypes.func.isRequired,
    node: PropTypes.object.isRequired,
    showModal: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      title: props.node.question.title
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.node.question.title
    });
  }

  handleEditClick = () => {
    const { isEditing } = this.state;
    const { node: { question } } = this.props;
    this.setState({
      isEditing: !isEditing,
      title: question.title
    });
  }

  handleDeleteClick = () => {
    const { deleteGroup, node, node: { question }, showModal } = this.props;
    if (node.children) {
      showModal('deleteGroupFailureModal');
    } else {
      deleteGroup(question.id);
    }
  }

  handleChangeTitle = (event) => {
    this.setState({ title: event.target.value });
  }

  handleUpdateTtile = () => {
    const { node: { question }, updateGroup } = this.props;
    const { title } = this.state;
    updateGroup({ id: question.id, title });
    this.setState({ isEditing: false });
  }

  renderEditBox() {
    const { title } = this.state;
    return (
      <FormGroup>
        <InputGroup>
          <FormControl type="text" value={title} onChange={this.handleChangeTitle} />
          <InputGroup.Button>
            <Button onClick={this.handleUpdateTtile}><MdDone size={18} /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }

  render() {
    const { node: { question } } = this.props;
    const { isEditing } = this.state;
    return (
      <div className={styles.wrapper}>
        <div className={classNames(styles.titleCell, { [styles.editing]: isEditing })}>
          {isEditing
            ? this.renderEditBox()
            : question.title
          }
        </div>
        <div className={styles.actionCell}>
          <Button className={styles.actionButton} bsStyle="link" bsSize="sm"
            onClick={this.handleEditClick}>
            <MdEdit size={18} />
            <span className={styles.buttonLabel}>Edit</span>
          </Button>
        </div>
        <div className={styles.actionCell}>
          <Button className={styles.actionButton} bsStyle="link" bsSize="sm"
            onClick={this.handleDeleteClick}>
            <MdDelete size={18} />
            <span className={styles.buttonLabel}>Delete</span>
          </Button>
        </div>
        <DeleteGroupFailureModal />
      </div>
    );
  }
}
