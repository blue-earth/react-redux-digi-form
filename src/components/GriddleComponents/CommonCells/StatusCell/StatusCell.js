import React, {
  Component,
  PropTypes
} from 'react';
import StatusText from 'components/StatusText';

class StatusCell extends Component {
  static propTypes = {
    data: PropTypes.string
  };
  render() {
    const {data} = this.props;
    return (<StatusText status={data} />);
  }
}

export default StatusCell;
