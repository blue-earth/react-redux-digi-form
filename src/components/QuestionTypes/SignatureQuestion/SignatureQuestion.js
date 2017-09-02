import React, {
  Component,
  PropTypes
} from 'react';

class SignatureQuestion extends Component {

  static propTypes = {
    value: PropTypes.object,
    showModal: PropTypes.func
  };

  static defaultProps = {
  };

  render() {
    return (<p>signature question</p>);
  }
}

export default SignatureQuestion;
