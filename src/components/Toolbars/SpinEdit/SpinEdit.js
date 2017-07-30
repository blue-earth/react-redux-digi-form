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
import styles from './SpinEdit.scss';

export default class SpinEdit extends Component {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number
  };

  static defaultProps = {
    onChange: () => {},
    value: 0
  }

  handleDecreaseClick = () => {
    const { onChange, value } = this.props;
    onChange(value - 1);
  }

  handleIncraseClick = () => {
    const { onChange, value } = this.props;
    onChange(value + 1);
  }

  handleValueChange = (event) => {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    const { label, value } = this.props;
    return (
      <ul className={styles.spinEdit}>
        {label &&
          <li className={styles.label}>{label}</li>
        }
        <li>
          <Button className={styles.circleButton} onClick={this.handleDecreaseClick}>
            <MdRemove />
          </Button>
        </li>
        <li>
          <FormControl type="number" onChange={this.handleValueChange} value={value} className={styles.input} />
        </li>
        <li>
          <Button className={styles.circleButton} onClick={this.handleIncraseClick}>
            <MdAdd />
          </Button>
        </li>
      </ul>
    );
  }
}
