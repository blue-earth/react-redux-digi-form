import React, { Component, PropTypes } from 'react';
import styles from './DropdownInput.scss';

class DropdownInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    isDisabled: false,
    choices: [],
    value: '',
    onChange: () => {},
    onEnterKey: () => {}
  };

  handleChange = (event) => {
    const { onChange, onEnterKey } = this.props;
    if (typeof onChange === 'function') {
      onChange(event.target.value);
    }
    if (typeof onEnterKey === 'function') {
      setTimeout(onEnterKey, 50);
    }
  }

  render() {
    const { isDisabled, value, choices } = this.props;
    const { primaryColor } = this.context;
    var optionals = {};
    
    if (isDisabled) {
      optionals['disabled'] = 'disabled'
    }

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor
      };
    }

    var choicesList = choices.map((item, index) => {
      return <option value={item} key={index}>{item}</option>;
    });
    choicesList.unshift(<option value=""></option>);

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

export default DropdownInput;
