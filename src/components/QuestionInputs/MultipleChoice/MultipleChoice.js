import React, { Component, PropTypes } from 'react';
import styles from './MultipleChoice.scss';
import MultipleChoiceItem from './MultipleChoiceItem.js';
import _ from 'lodash';

class MultipleChoice extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    allowMultiple: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    isDisabled: false,
    allowMultiple: false,
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
    const { dispatch, allowMultiple, onChange, onEnterKey, value } = this.props;
      if ( allowMultiple ) {
        var newValue = _.xorWith(value, [val], _.isEqual);
        onChange(newValue);
      } else {
        onChange(val);
        setTimeout(onEnterKey, 50);
      }
  }

  isActiveItem(item) {
    var values = this.props.value;
    if (typeof values !== 'object') return false;
    if (values.constructor !== Array) values = [values];
    return typeof _.find(values, item) !== 'undefined';
  }

  render() {
    const { isDisabled, value, choices, allowMultiple } = this.props;
    const that = this;

    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = 'disabled'
    }

    var choicesList = choices.map(function(item){
      return <MultipleChoiceItem
        key={item.label}
        label={item.label}
        text={item.text}
        active={that.isActiveItem(item)}
        onClick={that.handleClick}
      />
    });

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
