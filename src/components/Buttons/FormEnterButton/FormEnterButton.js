import React, { Component, PropTypes } from 'react';
import styles from './FormEnterButton.scss';


class FormEnterButton extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    primaryColor: PropTypes.string,
  };

  static defaultProps = {
    primaryColor: '#4dcceb'
  };

  render() {

    const props = this.props

    var buttonStyle = {
      color: props.primaryColor,
      borderColor: props.primaryColor
    }

    return (
      <button type="button" className={styles.formEnterButton} style={buttonStyle}>
        <div className={styles.btnInner}>
          <div>press</div>
          <div>ENTER</div>
        </div>
      </button>
    )
  }
}

export default FormEnterButton



