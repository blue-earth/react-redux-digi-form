import React, { Component, PropTypes } from 'react';
import styles from './Statement.scss';

class Statement extends Component {

  static propTypes = {
    instruction: PropTypes.string,
  };

  static defaultProps = {
    instruction: ''
  };

  render() {
    const { instruction } = this.props;

    return (
      <div className={styles.instruction}
        dangerouslySetInnerHTML={{__html: instruction}}>
      </div>
    );
  }
}

export default Statement;
