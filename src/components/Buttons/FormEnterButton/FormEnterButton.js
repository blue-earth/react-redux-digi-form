import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import styles from './FormEnterButton.scss'


class FormEnterButton extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    primaryColor: PropTypes.string,
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool
  };

  static defaultProps = {
    primaryColor: '#4dcceb'
  };

  handleClick() {
    const { onClick } = this.props
    if (typeof onClick === 'function') onClick()
  }

  render() {

    const props = this.props

    var buttonStyle = {
      color: props.primaryColor,
      borderColor: props.primaryColor
    }

    var optionals = {}
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled'
    }

    return (
      <Button type="button" onClick={this.handleClick.bind(this)}
        className={styles.formEnterButton} style={buttonStyle}
        {...optionals}>
        <div className={styles.btnInner}>
          <div>press</div>
          <div>ENTER</div>
        </div>
      </Button>
    )
  }
}

export default FormEnterButton



