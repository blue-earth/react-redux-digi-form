import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import styles from './SelectButton.scss';
import classNames from 'classnames/bind';
import { FaAngleDown } from 'react-icons/lib/fa';

const cx = classNames.bind(styles);

class SelectButton extends Component {

  static propTypes = {
    /**
     * Button click event handler when no options
     */
    onClick: PropTypes.func,
    /**
     * Dropdown option click event handler
     */
    onChange: PropTypes.func,
    /**
     * The value of selected item and display in bold after label
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    /**
     * The label content for the selection. If it's a string, place a `:` after
     */
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    /**
     * Selection items list
     */
    optionsList: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Label for dropdown item display
         */
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.node,
          PropTypes.number
        ]),
        /**
         * substitute value if label is node
         */
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        /**
         * OnChange calling value
         */
        key: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ])
      })
    ),
    /**
     * Classname for the out wrapper
     */
    className: PropTypes.string,
    /**
     * Do not change current default value while selected.
     */
    isStaticValue: PropTypes.bool,
    /**
     * Hide value display.
     */
    isValueHidden: PropTypes.bool
  };

  static defaultProps = {
    value: '',
    optionsList: [], // optionslist consist of the following structor
    label: '',
    isStaticValue: false,
    isValueHidden: false,
    onChange: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: props.value
    };
  }

  componentDidMount() {
    /**
     * Event listener for closing dropdown.
     */
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touch', this.handleDocumentClick, false);
  }
  componentWillUnmount() {
    /**
     * Remove event listener for closing dropdown.
     */
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touch', this.handleDocumentClick, false);
  }
  /**
   * When value props updated change selected item
   */
  componentWillReceiveProps(props) {
    if (props.value && props.value !== this.state.selected) {
      this.setState({selected: props.value});
    }
  }

  toggleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleSelect = (index) => {
    const {isStaticValue, onChange, optionsList} = this.props;
    const option = optionsList[index];
    if (!optionsList[index].isDisabled) {
      onChange(option.key);
    }
    if (isStaticValue) {
      return this.setState({
        isOpen: false
      });
    }
    this.setState({
      selected: option.value || option.label, // Use value first, incase label is not a string or number
      isOpen: false
    });
  }

  handleDocumentClick = (event) => {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { label, isStaticValue, optionsList, className, isValueHidden } = this.props;
    const { selected, isOpen } = this.state;
    const dropdownButton = (
      <div className={cx(className)}>
        <div ref="dropdown" className={cx('selectWrapper', {
          isOpen: this.state.isOpen
        })}>
          <div className={cx('selectLabel')} onClick={this.toggleOpen}>
            <div className={cx('pullLeft')}>
              {label}
              {label && label.length > 0 ? ':' : ' '}
            </div>
            <div className={cx('selectValue', {invisible: isOpen && label.length > 0 && !isStaticValue})}>
              {!isValueHidden && selected}
            </div>
            <div className={cx('selectCaret')}>
              <FaAngleDown />
            </div>
          </div>
          <div className={cx('selectOptionsWrapper')}>
            <ul className={cx('selectOptions')}>
              {optionsList.map((option, index) => {
                const handleSelect = this.handleSelect.bind(this, index);
                return (
                  <li key={`select-button-${index}`}
                    className={cx(
                      'selectOption',
                      {
                        isSelected: selected === (option.value || option.label),
                        disabled: option.isDisabled
                      }
                    )}
                    onClick={handleSelect}>
                    <div className={cx('selectOptionContent')}>{option.label}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
    const selectButton = (
      <div className={cx(className)}>
        <div ref="dropdown" className={cx('selectWrapper')} onClick={this.props.onClick}>
          <div className={cx('selectLabel')} onMouseDown={this.toggleOpen}>
            {label}
          </div>
        </div>
      </div>
    );
    return optionsList.length === 0 ? selectButton : dropdownButton;
  }
}

export default SelectButton;
