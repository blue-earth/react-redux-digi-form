import React, {
  Component,
  PropTypes
} from 'react';
import styles from './FlowLine.scss';
import classNames from 'classnames';

class FlowLine extends Component {

  static propTypes = {
    forPreview: PropTypes.bool
  };

  static defaultProps = {
    forPreview: false
  };

  render() {
    const { forPreview } = this.props;
    const flowlineClass = classNames({
      [styles.flowLine]: !forPreview,
      [styles.previewFlowLine]: forPreview
    });
    return (
      <div className={flowlineClass}></div>
    );
  }
}

export default FlowLine;
