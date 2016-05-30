import React, { Component, PropTypes } from 'react';
import styles from './FormEnterButton.scss';


class FormEnterButton extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    primaryColor: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    primaryColor: '#4dcceb'
  };

  handleClick() {
    const { onClick } = this.props
    if (typeof onClick === 'function') onClick(value)
  }

  render() {

    const props = this.props

    var buttonStyle = {
      color: props.primaryColor,
      borderColor: props.primaryColor
    }

    return (
      <button type="button" onClick={this.handleClick.bind(this)}
        className={styles.formEnterButton} style={buttonStyle}>
        <div className={styles.btnInner}>
          <div>press</div>
          <div>ENTER</div>
        </div>
      </button>
    )
  }
}

export default FormEnterButton



