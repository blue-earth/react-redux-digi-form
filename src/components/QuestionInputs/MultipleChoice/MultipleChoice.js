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
      if (typeof onEnterKey === 'function') {
        setTimeout(onEnterKey, 50);
      }
    }
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

  render() {
    const { isDisabled, isReadOnly, value, choices, allowMultiple, includeOther } = this.props;
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
    var choicesList = choices.map((item) => {
      return ChoiceItemTemplate(item);
    });

    if (includeOther) {
      var lastLabel = 'A';
      lastLabel = String.fromCharCode(lastLabel.charCodeAt(0) + choices.length);
      choicesList.push(
        ChoiceItemTemplate({label: lastLabel, text: textOther})
      )
    }

    return (
      <div className={styles.choicesContainer} {...optionals}>
        <div className={styles.choicesRow}>
          {choicesList}
        </div>
      </div>
    );
  }
}

export default MultipleChoice;
