import React, {
  Component,
  PropTypes
} from 'react';

import SectionTitle from '../SectionTitle';

class AnswerOutputTypeStatus extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired
  };

  render() {
    return (
      <div style={{'overflow': 'hidden'}}>
        <SectionTitle style={{'float': 'left'}} title={'Answer output style'} />
        <SectionTitle style={{'float': 'right'}} title={this.props.status} />
      </div>
    );
  };
}

export default AnswerOutputTypeStatus;
