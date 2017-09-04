import React, {
  Component,
  PropTypes
} from 'react';
import styles from './MultipleChoice.scss';
import MultipleChoiceItem from './MultipleChoiceItem.js';
import _ from 'lodash';

const textOther = 'Other';

class MultipleChoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    allowMultiple: PropTypes.bool,
    includeOther: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
    autoFocus: PropTypes.bool,
    errors: PropTypes.array
  };

  static defaultProps = {
    isDisabled: false,
    allowMultiple: false,
    includeOther: false,
    choices: [{text: 'First Selection', label: 'A'}],
    value: [],
    onChange: () => {},
    onEnterKey: () => {},
    autoFocus: true
  };

  componentDidMount() {
    const { autoFocus } = this.props;
    const { choiceContainer } = this.refs;
    if (autoFocus) {
      setTimeout(function () {
        choiceContainer.focus();
      }, 50);
    }
    window.addEventListener('resize', this.alignmentResizeHandle);
    setTimeout(this.alignmentHandle);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.alignmentResizeHandle);
  }

  alignmentResizeHandle = () => {
    const { width } = this.state;
    var realWidth = 0;
    if (Object.keys(this.refs).length !== 0) {
      if (width > this.refs.choiceContainer.offsetWidth * 46 / 100) {
        realWidth = '97%';
      } else if (width < this.refs.choiceContainer.offsetWidth * 30 / 100) {
        realWidth = '46%';
      } else {
        realWidth = `${width}px`;
      }
      for (var index in this.allChoices) {
        this.refs[`ChoiceItem${index}`].refs.divForMultipleChoiceItem.style.width = realWidth;
      }
    }
  };

  alignmentHandle = () => {
    var width = 0;
    var calcWidth = 0;
    if (Object.keys(this.refs).length !== 0) {
      for (var index in this.allChoices) {
        if (width < this.refs[`ChoiceItem${index}`].refs.divForMultipleChoiceItem.offsetWidth) {
          width = this.refs[`ChoiceItem${index}`].refs.divForMultipleChoiceItem.offsetWidth;
        }
      }
      if (width > this.refs.choiceContainer.offsetWidth * 46 / 100) {
        width = '97%';
        calcWidth = this.refs.choiceContainer.offsetWidth * 97 / 100;
      } else if (width < this.refs.choiceContainer.offsetWidth * 30 / 100) {
        width = '46%';
        calcWidth = this.refs.choiceContainer.offsetWidth * 46 / 100;
      } else {
        calcWidth = width + 1;
        width = `${width+1}px`;
      }
      this.setState({
        width: calcWidth
      });
      for (index in this.allChoices) {
        this.refs[`ChoiceItem${index}`].refs.divForMultipleChoiceItem.style.width = width;
      }
    }
  };

  handleClick = (selectedChoice) => {
    const {
      allowMultiple,
      onChange,
      onEnterKey,
      value
    } = this.props;
    var selectedArray;
    if (allowMultiple) {
      // selectedChoice is currently selected, deselect it
      if (value.filter((_val) => _val.label === selectedChoice.label).length) {
        selectedArray = value.filter(item => item.label !== selectedChoice.label);
      } else {
        selectedArray = [...value, selectedChoice];
      }
      onChange(selectedArray);
    } else {
      onChange([selectedChoice]);
      setTimeout(onEnterKey, 50);
    }
  };

  get allChoices() {
    // This function injects an "other" to the end of choices
    // if the question is configured "includeOther"
    const { choices, includeOther } = this.props;
    var _allChoices = choices.slice(0);
    if (includeOther) {
      var lastLabel = 'A';
      lastLabel = String.fromCharCode(lastLabel.charCodeAt(0) + choices.length);
      _allChoices.push({label: lastLabel, text: textOther});
    }
    return _allChoices;
  }

  isItemSelected(item) {
    return this.props.value.filter(
      selectedItem => selectedItem.label === item.label).length > 0;
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    const allChoices = this.allChoices;
    if (event.keyCode === 13) {
      onEnterKey();
    } else {
      const foundIndex = _.findIndex(allChoices, { label: String.fromCharCode(event.keyCode) });
      if (foundIndex > -1) {
        this.handleClick(allChoices[foundIndex]);
      }
    }
  };

  render() {
    const that = this;
    const { errors } = this.props;
    var optionals = {};
    var ChoiceItemTemplate = (item, index) => {
      const isSelected = that.isItemSelected(item);
      return <MultipleChoiceItem
        key={`${item.label}-${item.text}`}
        label={item.label}
        text={item.text}
        active={isSelected}
        onClick={that.handleClick}
        ref={`ChoiceItem${index}`}
      />;
    };
    var choicesList = this.allChoices.map((item, index) => {
      return ChoiceItemTemplate(item, index);
    });

    return (
      <div className={styles.choicesContainer}
        tabIndex={0} onKeyDown={this.handleKeyDown}
        ref="choiceContainer"
        {...optionals}>
        <div className={styles.choicesRow}>
          {choicesList}
        </div>
        {errors.length > 0 &&
        errors.map((error, i) => <p className={styles.error} key={i}>{error}</p>)}
      </div>
    );
  }
}

export default MultipleChoice;
