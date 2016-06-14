import React, { Component, PropTypes } from 'react';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import _ from 'lodash';

class YesNoChoice extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
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
    value: {
      text: '',
      label: ''
    },
    onChange: () => {},
    onEnterKey: () => {}
  };

  render() {
    const { isDisabled, isReadOnly, value, onChange, onEnterKey, autoFocus } = this.props;
    const choices = [
      {
        text: 'Yes',
        label: 'Y'
      },
      {
        text: 'No',
        label: 'N'
      }
    ];

    return (
      <MultipleChoice
        value={value}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        autoFocus={autoFocus}
        onChange={onChange}
        onEnterKey={onEnterKey}
        choices={choices}
      />
    );
  }
}

export default YesNoChoice;
