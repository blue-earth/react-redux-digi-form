import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Collapse
} from 'react-bootstrap';
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from 'react-icons/lib/md';
import QuestionInteractive from 'components/Questions/QuestionInteractive';
import FormRow from 'components/Forms/FormRow/FormRow';
import {
  getContextFromAnswer,
  getFirstQuestionOfGroup,
  shouldDisableNextButton,
  shouldDisablePrevButton
} from 'helpers/formInteractiveHelper';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormInteractiveView.scss';
import _ from 'lodash';

class FormInteractiveView extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    /**
     * List of questions for current question group
     */
    questions: PropTypes.object.isRequired,
    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,
    /*
     * goToQuestion: Redux action to move to specific question by ID.
     */
    goToQuestion: PropTypes.func.isRequired,
    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,
    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired,
    /*
     * show: Redux modal show
     */
    showModal: PropTypes.func.isRequired
  };

  static defaultProps = {
  };

  render() {
    return <div>Form interactive view</div>;
  }

}

export default FormInteractiveView;
