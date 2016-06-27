import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import FormEnterButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import SignatureModal from './SignatureModal';
import styles from './Signature.scss';

class Signature extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    show: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    value: '',
    onChange: () => {},
    show: () => {}
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
  }

  focusSignatureImage() {
    const { autoFocus } = this.props;
    const signatureImage = this.refs.signatureImage;
    console.log(signatureImage, autoFocus)
    if (autoFocus && signatureImage) {
      setTimeout(function () {
        signatureImage.focus();
      }, 50);
    }
  }

  handleChange = (value) => {
    const { onChange } = this.props;
    onChange(value);
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13) {
      onEnterKey();
    }
  }

  render() {
    const { show, value, isReadOnly, isDisabled, autoFocus } = this.props;
    return (
      <div className={styles.signature}>
        {value &&
          <img src={value} alt="signature"
            className={styles.signatureImage}
            ref="signatureImage"
            tabIndex={0} onKeyDown={this.handleKeyDown} />
        }
        {!isReadOnly &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isDisabled}
            autoFocus={!value && autoFocus}
            onClick={function () {show('signatureModal')}} />
        }
        <SignatureModal onSave={this.handleChange} value={value} />
      </div>
    );
  }
}

export default Signature;
