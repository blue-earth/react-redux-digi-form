import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  FormControl
} from 'react-bootstrap';
import {
  MdAdd,
  MdRemove
} from 'react-icons/lib/md';
import Label from '../Label';
import styles from './SpinEdit.scss';

export default class SpinEdit extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number
  };

  static defaultProps = {
    disabled: false,
    onChange: () => {},
    value: 0
  }

  handleDecreaseClick = () => {
    const { onChange, value } = this.props;
    onChange(parseInt(value, 10) - 1);
  }

  handleIncraseClick = () => {
    const { onChange, value } = this.props;
    onChange(parseInt(value, 10) + 1);
  }

  handleValueChange = (event) => {
    const { onChange } = this.props;
    onChange(parseInt(event.target.value, 10));
  }

  render() {
    const { disabled, label, value } = this.props;
    return (
      <ul className={styles.spinEdit}>
        {label &&
          <li><Label>{label}</Label></li>
        }
        <li>
          <Button className={styles.circleButton} disabled={disabled} onClick={this.handleDecreaseClick}>
            <MdRemove />
          </Button>
        </li>
        <li>
          <FormControl disabled={disabled} type="number" onChange={this.handleValueChange} value={value}
            className={styles.input} />
        </li>
        <li>
          <Button className={styles.circleButton} disabled={disabled} onClick={this.handleIncraseClick}>
            <MdAdd />
          </Button>
        </li>
      </ul>
    );
  }
}
