import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import {
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/lib/md';
import styles from './ArrowButton.scss';

class ArrowButton extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(['left', 'right']),
    onClick: PropTypes.func
  };

  static contextTypes = {
    primaryColor: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {}
  };

  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  addHoverClass = () => {
    this.setState({ hover: true });
  }

  removeHoverClass = () => {
    this.setState({ hover: false });
  }

  render() {
    const { hover } = this.state;
    const { primaryColor } = this.context;
    const { direction } = this.props;
    let optionals = {};
    hover && (optionals['style'] = { color: primaryColor });
    return (
      <Button className={styles.arrowButton}
        onMouseEnter={this.addHoverClass}
        onMouseLeave={this.removeHoverClass}
        {...optionals}>
        {direction === 'left' && <MdChevronLeft size={24} />}
        {direction === 'right' && <MdChevronRight size={24} />}
      </Button>
    );
  }
}

export default ArrowButton;
