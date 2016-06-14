import React, { Component, PropTypes } from 'react';
import styles from './MultipleChoice.scss';
import MultipleChoiceItem from './MultipleChoiceItem.js';
import _ from 'lodash';

const textOther = 'Other';

class MultipleChoice extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    allowMultiple: PropTypes.bool,
    maxAnswers: PropTypes.number,
    includeOther: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    allowMultiple: false,
    maxAnswers: 0,
    includeOther: false,
    choices: [
      {
        text: 'First Selection',
        label: 'A'
      },
      {
        text: 'Second Selection',
        label: 'B'
      }
    ],
    value: {
      text: '',
      label: ''
    },
    onChange: () => {},
    onEnterKey: () => {}
  };

  
  componentDidMount() {
    const { autoFocus } = this.props;
    const { choiceContainer } = this.refs;
    if ( autoFocus ) {
      setTimeout(function() {
        choiceContainer.focus()
      }, 50);
    }
  }

  handleClick = (val) => {
    const { dispatch, allowMultiple, maxAnswers, 
      onChange, onEnterKey, value } = this.props;
    if (typeof onChange !== 'function') return;
    if ( allowMultiple ) {
      var newValue = _.xorWith(value, [val], _.isEqual);
      if ( this.canAcceptChange(newValue) ) {
        onChange(newValue);
      }
    } else {
      onChange(val);
      setTimeout(onEnterKey, 50);
    }
  }

  get allChoices() {
    const { choices, includeOther } = this.props;
    var _allChoices = choices.slice(0);
    if (includeOther) {
      var lastLabel = 'A';
      lastLabel = String.fromCharCode(lastLabel.charCodeAt(0) + choices.length);
      _allChoices.push({label: lastLabel, text: textOther});
    }
    return _allChoices;
  }

  canAcceptChange(value) {
    const { maxAnswers } = this.props;
    if ( maxAnswers > 0 && value.length > maxAnswers ) return false;
    return true;
  }

  isMultiSelectable(value) {
    const { maxAnswers } = this.props;
    if ( maxAnswers > 0 && value.length >= maxAnswers ) return false;
    return true;
  }

  isActiveItem(item) {
    var values = this.props.value;
    if (typeof values !== 'object') return false;
    if (values.constructor !== Array) values = [values];
    return typeof _.find(values, {label: item.label}) !== 'undefined';
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    const allChoices = this.allChoices;
    if (event.keyCode === 13) {
      onEnterKey()
    }
    console.log(String.fromCharCode(event.keyCode));
    const foundIndex = _.findIndex(allChoices, { label: String.fromCharCode(event.keyCode) });
    if (foundIndex > -1) {
      this.handleClick(allChoices[foundIndex]);
    }
  }

  render() {
    const { isDisabled, isReadOnly, value, choices, autoFocus,
      allowMultiple, includeOther } = this.props;
    const that = this;
    const isMultiSelectable = that.isMultiSelectable(value);
    var optionals = {};
    var ChoiceItemTemplate = (item) => {
      const active = that.isActiveItem(item);
      const disabled = isDisabled || isReadOnly || !active && (allowMultiple && !isMultiSelectable)
      return <MultipleChoiceItem
        key={`${item.label}-${item.text}`}
        label={item.label}
        text={item.text}
        active={active}
        disabled={disabled}
        onClick={that.handleClick}
      />
    }
    console.log(this.allChoices)
    var choicesList = this.allChoices.map((item) => {
      return ChoiceItemTemplate(item);
    });

    return (
      <div className={styles.choicesContainer}
        tabIndex={0} onKeyDown={this.handleKeyDown}
        autoFocus={autoFocus}
        ref="choiceContainer"
        {...optionals}>
        <div className={styles.choicesRow}>
          {choicesList}
        </div>
      </div>
    );
  }
}

export default MultipleChoice;
