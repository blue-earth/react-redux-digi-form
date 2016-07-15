import React, {
  Component,
  PropTypes
} from 'react';
import styles from './DropdownInput.scss';

class DropdownInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    choices: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
    includeBlank: PropTypes.bool
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    choices: [],
    value: '',
    includeBlank: true,
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
    const { isDisabled, isReadOnly, value, choices, includeBlank } = this.props;
    const { primaryColor } = this.context;
    var optionals = {};

    if (isDisabled || isReadOnly) {
      optionals['disabled'] = 'disabled';
    }

    if (typeof primaryColor !== 'undefined') {
      optionals['style'] = {
        color: primaryColor
      };
    }

    var choicesList = choices.map((item, index) => {
      return <option value={item} key={index}>{item}</option>;
    });

    if (includeBlank) {
      choicesList.unshift(<option value="" key="empty_field"></option>);
    }

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
