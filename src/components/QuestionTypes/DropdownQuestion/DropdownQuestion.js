import React, {
  Component,
  PropTypes
} from 'react';
import styles from './DropdownQuestion.scss';

class DropdownQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.string,
    storeAnswer: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,
    changeCurrentState: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: ''
  };

  handleChange = (e) => {
    const value = e.target.value;
    var id = this.props.compiledQuestion.id;
    this.props.changeCurrentState({
      answerValue: value
    });
    this.props.storeAnswer({
      id,
      value
    });
    this.props.handleEnter();
  };

  render() {
    const { value, compiledQuestion: { choices } } = this.props;
    const { primaryColour } = this.context;
    var optionals = {};
    if (typeof primaryColour !== 'undefined') {
      optionals['style'] = {
        color: primaryColour
      };
    }
    console.log(choices);
    var choicesList = choices.map((item, index) => {
      return <option value={item.text} key={index}>{item.text}</option>;
    });

    choicesList.unshift(<option value="" key="empty_field"></option>);

    return (
      <select className={styles.dropdownInput}
        onChange={this.handleChange}
        value={value}
        {...optionals}>
        {choicesList}
      </select>
    );
  }
}

export default DropdownQuestion;
