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
    value: PropTypes.string,
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
    if (this.props.staticValue) {
      return this.setState({isOpen: false});
    }
    this.setState({
      selected: event.target.getAttribute('value'),
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
    const { label, staticValue } = this.props;
    const { selected, isOpen } = this.state;
    var cx = this.cx;
    return (
      <div className={this.props.className}>
        <div ref="dropdown" className={cx('selectWrapper', {
          isOpen: this.state.isOpen
        })}>
          <div className={cx('selectLabel')} onMouseDown={this.toggleOpen}>
            <div className={cx('pullLeft')}>{label}{label && label.length > 0 ? ':' : ' '}</div>
            <div className={cx('selectValue', {invisible: isOpen && !staticValue})}>{selected}</div>
            <div className={cx('selectCaret')}><FaAngleDown /></div>
          </div>
          <div className={cx('selectOptionsWrapper')}>
            <ul className={cx('selectOptions')}>
              {this.props.optionList.map((option) => {
                return (
                  <li key={option.key}
                    className={cx('selectOption', {isSelected: selected === option.label})}
                    onClick={this.handleSelect} value={option.label}>
                    <div className={cx('selectOptionContent')} value={option.label}>{option.label}</div>
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

export default SelectButton;
