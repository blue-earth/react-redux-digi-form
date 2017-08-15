import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import styles from './SelectBox.scss';
import classNames from 'classnames/bind';
import { FaAngleDown } from 'react-icons/lib/fa';
import _ from 'lodash';

const cx = classNames.bind(styles);

class SelectBox extends Component {

  static propTypes = {
    /**
     * Dropdown option click event handler
     */
    onChange: PropTypes.func,
    /**
     * The value of selected item
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    /**
     * The label content for the selection.
     */
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    labelPosition: PropTypes.string,
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
         * value is passed to onChange
         */
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        isDisabled: PropTypes.bool
      })
    ),
    /**
     * Classname for the outer wrapper
     */
    className: PropTypes.string,
    /*
     * placeholder text for when there is no selected value
     */
    placeholder: PropTypes.string
  };

  static defaultProps = {
    value: '',
    optionsList: [],
    label: '',
    labelPosition: 'inline',
    onChange: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedIndex: null
    };
  }

  componentDidMount() {
    /**
     * Event listener for closing dropdown.
     */
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touch', this.handleDocumentClick, false);
    const { value, optionsList } = this.props;
    // get the selected index
    if (value) {
      var i = _.findIndex(optionsList, function (o) { return o.value === value; });
      if (i !== -1 && i !== this.state.selectedIndex) {
        this.setState({ selectedIndex: i });
      }
    } else if (!value && !this.props.placeholder) {
      // select the first item in optionsList
      this.props.onChange(optionsList[0].key);
      this.setState({ selectedIndex: 0 });
    }
  }

  componentWillUnmount() {
    /**
     * Remove event listener for closing dropdown.
     */
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touch', this.handleDocumentClick, false);
  }

  toggleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSelect = (index) => {
    const {onChange, optionsList} = this.props;
    const option = optionsList[index];
    if (!optionsList[index].isDisabled) {
      onChange(option.value);
      this.setState({
        selectedIndex: index,
        isOpen: false
      });
    }
  }

  handleDocumentClick = (event) => {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  renderValue() {
    const { optionsList, placeholder } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex !== null) {
      return (<span>{optionsList[selectedIndex].label}</span>);
    } else if (placeholder) {
      return (<span className={cx([styles.placeholder])}>{placeholder}</span>);
    } else {
      return false;
    }
  }

  render() {
    const { label, labelPosition, optionsList, className } = this.props;
    const { selectedIndex } = this.state;
    const that = this;
    return (
      <div className={cx('selectBox', className)}>
        {label && <span className={cx('selectBoxLabel', [labelPosition])}>{label}</span>}
        <div ref="dropdown" className={cx('selectWrapper', {
          isOpen: this.state.isOpen
        })}>
          <div className={cx('selectLabel')} onClick={this.toggleOpen}>
            <div className={cx('selectValue')}>
              {this.renderValue()}
            </div>
            <div className={cx('selectCaret')}>
              <FaAngleDown />
            </div>
          </div>
          <div className={cx('selectOptionsWrapper')}>
            <ul className={cx('selectOptions')}>
              {optionsList.map((option, index) => {
                return (
                  <li key={`select-button-${index}`}
                    className={cx(
                      'selectOption',
                      {
                        isSelected: selectedIndex === index,
                        disabled: option.isDisabled
                      }
                    )}
                    onClick={function () { that.handleSelect(index); }}>
                    <div className={cx('selectOptionContent')}>{option.label}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectBox;
