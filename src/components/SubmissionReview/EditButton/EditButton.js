import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import styles from './EditButton.scss';

export default class EditButton extends Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {}
  };

  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  componentWillReceiveProps(props) {
    this.setState({ hover: false });
  }

  addHoverClass = () => {
    this.setState({ hover: true });
  }

  removeHoverClass = () => {
    this.setState({ hover: false });
  }

  render() {
    const { hover } = this.state;
    const { primaryColour } = this.context;
    const { onClick } = this.props;
    let optionals = {};
    hover
    ? (optionals['style'] = { color: 'white', backgroundColor: primaryColour, borderColor: primaryColour })
    : (optionals['style'] = { color: primaryColour, backgroundColor: 'white', borderColor: primaryColour });
    return (
      <Button className={styles.editButton}
        onMouseOver={this.addHoverClass}
        onMouseLeave={this.removeHoverClass}
        onClick={onClick}
        {...optionals}>
        EDIT
      </Button>
    );
  }
}
