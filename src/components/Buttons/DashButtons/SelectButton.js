import React, {
  Component,
  PropTypes
} from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './DashButtons.scss';
import Spinner from 'components/Spinner';

class SelectButton extends Component {
  static propTypes = {

    // click function, currently only takes 1 argument
    onClick: PropTypes.func,

    // disables the button if true
    isDisabled: PropTypes.bool,

    // disables the button and adds a spinner icon
    isLoading: PropTypes.bool,

    label: PropTypes.string,

    style: PropTypes.oneOf(['headerButton', 'formButton', 'defaultButton']),

    // adds css min-width in pixels
    defaultWidth: PropTypes.number,

    /* array of objects with elements
    key (string), eventKey (string), label (string), divider (bool)
    divider creates a horizontal line
    eg.
    [{key: 'keystring', eventKey: 'keystring', label: 'something'},
    {key: 'keystring', divider: true}]
    */
    optionList: PropTypes.array,

    // html id attribute.
    // this is required for dropdowns or it will throw an error
    id: PropTypes.string.isRequired,

    // aligns a dropdown to the right of the button
    pullRight: PropTypes.bool
  };

  static defaultProps = {
    style: 'defaultButton',
    id: 'id',
    label: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  };

  handleSelect = (arg) => {
    const { onClick, isLoading, optionList } = this.props;
    var newIndex = false;
    for (var i = 0; i < optionList.length; i += 1) {
      if (optionList[i]['key'] === arg) {
        newIndex = i;
      }
    }
    this.setState({ selectedIndex: newIndex });
    if (typeof onClick === 'function' && !isLoading) onClick(optionList[newIndex]);
  }

  getWrapperClass() {
    const { style, isLoading } = this.props;
    return classNames({
      [styles.headerButton]: style === 'headerButton',
      [styles.formButton]: style === 'formButton',
      [styles.defaultButton]: style === 'defaultButton',
      [styles.loading]: isLoading === true
    });
  }

  getOptionalParams() {
    const { isDisabled, defaultWidth, pullRight } = this.props;
    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = true;
    }
    if (pullRight) {
      optionals['pullRight'] = true;
    }
    if (defaultWidth) {
      optionals['style'] = { minWidth: defaultWidth };
    }
    return optionals;
  }

  // add a spinner to the button
  renderSpinner() {
    const { isLoading } = this.props;
    if (isLoading === true) {
      return (
        <Spinner />
      );
    } else {
      return false;
    }
  }

  render() {
    const { label, optionList, id } = this.props;
    const { selectedIndex } = this.state;
    let title = <span>
      {label}{label.length>0 ? ': ':''}
      <b>{optionList[selectedIndex].label}</b>
    </span>;
    return (
      <DropdownButton title={title} id={id}
        className={this.getWrapperClass()}
        {...this.getOptionalParams()}
      >
        {
          optionList.map((option) => {
            return (
              <MenuItem key={option.key} eventKey={option.eventKey}
                onSelect={this.handleSelect} divider={option.divider}
              >
                {option.label}
              </MenuItem>
            );
          })
        }
      </DropdownButton>
    );
  }
}

export default SelectButton;
