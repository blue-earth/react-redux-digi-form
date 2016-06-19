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
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    show: PropTypes.func
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    value: '',
    onChange: () => {},
    show: () => {}
  };

  componentDidMount() {

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

  render() {
    const { show, value, isReadOnly, isDisabled } = this.props;
    return (
      <div className={styles.signature}>
        {value &&
          <img src={value} alt="signature" />
        }
        {!isReadOnly &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isDisabled}
            onClick={function () {show('signatureModal')}} />
        }
        <SignatureModal onSave={this.handleChange} value={value} />
      </div>
    );
  }
}

export default Signature;
