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
    onClick: PropTypes.func,  // select button without dropdown options click event handler
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    optionList: PropTypes.array,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    className: PropTypes.string,
    staticValue: PropTypes.bool,
    displayValue: PropTypes.bool
  }
  static defaultProps = {
    value: '',
    optionList: [],
    label: '',
    staticValue: false,
    displayValue: true
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: props.value
    };
    this.mounted = true;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }
  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }
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
  handleSelect = (event) => {
    const {staticValue, onChange, optionList} = this.props;
    const index = event.currentTarget.getAttribute('data-key');
    const option = optionList[index];
    if (typeof onChange === 'function') {
      if (!optionList[index].isDisabled) {
        onChange(option.key);
      }
    }
    if (staticValue) {
      return this.setState({
        isOpen: false
      });
    }
    this.setState({
      selected: option.value || option.label,
      isOpen: false
    });
  }

  handleDocumentClick = (event) => {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  render() {
    const { label, staticValue, optionList, className, value, displayValue } = this.props;
    const { selected, isOpen } = this.state;
    const dropdownButton = (
      <div className={cx(className)}>
        <div ref="dropdown" className={cx('selectWrapper', {
          isOpen: this.state.isOpen
        })}>
          <div className={cx('selectLabel')} onMouseDown={this.toggleOpen}>
            <div className={cx('pullLeft')}>
              {label}
              {label && label.length > 0 ? ':' : ' '}</div>
            <div className={cx('selectValue', {invisible: isOpen && label.length > 0 && !staticValue})}>
              {displayValue && selected}
            </div>
            <div className={cx('selectCaret')}><FaAngleDown /></div>
          </div>
          <div className={cx('selectOptionsWrapper')}>
            <ul className={cx('selectOptions')}>
              {optionList.map((option, index) => {
                return (
                  <li key={`select-button-${index}`}
                    className={cx(
                      'selectOption',
                      {
                        isSelected: selected === (option.value || option.label),
                        disabled: option.isDisabled
                      }
                    )}
                    onClick={this.handleSelect}
                    data-key={index}>
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
        <div ref="dropdown" className={cx('selectWrapper')}>
          <div className={cx('selectLabel')} onMouseDown={this.toggleOpen}>
            <div className={cx('selectValue')}>{value}</div>
          </div>
        </div>
      </div>
    );
    return optionList.length === 0 ? selectButton : dropdownButton;
  }
}

export default SelectButton;
