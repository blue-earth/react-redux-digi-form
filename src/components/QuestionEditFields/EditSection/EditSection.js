import React, {
  Component,
  PropTypes
} from 'react';
import styles from './EditSection.scss';

class EditSection extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired
    ])
  };

  render() {
    return (
      <div className={styles.section}>
        {this.props.children}
      </div>
    );
  }
}

export default EditSection;
