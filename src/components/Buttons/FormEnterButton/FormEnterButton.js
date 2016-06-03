import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import styles from './FormEnterButton.scss'


class FormEnterButton extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool
  };

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  handleClick() {
    const { onClick } = this.props
    if (typeof onClick === 'function') onClick()
  }

  render() {

    const props = this.props
    var { primaryColor } = this.context;
    var optionals = {};

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor,
        borderColor: primaryColor
      }
    }

    if (props.isDisabled) {
      optionals['disabled'] = true
    }

    return (
      <Button type="button" onClick={this.handleClick.bind(this)}
        className={styles.formEnterButton}
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
