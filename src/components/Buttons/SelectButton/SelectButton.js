import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import styles from './SelectButton.scss';
import classNames from 'classnames/bind';
import { FaAngleDown } from 'react-icons/lib/fa';

class SelectButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,  // select button without dropdown options click event handler
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    optionList: PropTypes.array,
    label: PropTypes.string,
    className: PropTypes.string,
    staticValue: PropTypes.bool
  }
  static defaultProps = {
    value: '',
    optionList: [],
    label: '',
    staticValue: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: props.value
    };
    this.mounted = true;
    this.cx = classNames.bind(styles);
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
    const value = event.currentTarget.getAttribute('value');
    const index = event.currentTarget.getAttribute('data-key');

    if (typeof onChange === 'function') {
      if (!optionList[index].isDisabled) {
        onChange(optionList[index].key);
      }
    }
    if (staticValue) {
      return this.setState({isOpen: false});
    }
    this.setState({
      selected: value,
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
    const { label, staticValue, optionList, className, value } = this.props;
    const { selected, isOpen } = this.state;
    var cx = this.cx;
    const dropdownButton = (
      <div className={cx(className)}>
        <div ref="dropdown" className={cx('selectWrapper', {
          isOpen: this.state.isOpen
        })}>
          <div className={cx('selectLabel')} onMouseDown={this.toggleOpen}>
            <div className={cx('pullLeft')}>{label}{label && label.length > 0 ? ':' : ' '}</div>
            <div className={cx('selectValue', {invisible: isOpen && label.length > 0 && !staticValue})}>{selected}</div>
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
                        isSelected: selected === option.label,
                        disabled: option.isDisabled
                      }
                    )}
                    onClick={this.handleSelect}
                    value={option.label}
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
