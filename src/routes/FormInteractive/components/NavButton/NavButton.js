import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from 'react-icons/lib/md';
import classNames from 'classnames';
import styles from './NavButton.scss';

class NavButtonContainer extends Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    direction: PropTypes.oneOf(['up', 'down']),
    onClick: PropTypes.func,
    children: PropTypes.element
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

  componentWillReceiveProps(props) {
    props.isDisabled && this.setState({ hover: false });
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
    const { isDisabled, direction, children, onClick } = this.props;
    let optionals = {};
    hover && !isDisabled && (optionals['style'] = { color: primaryColor });
    const buttonClass = classNames(styles.navButton, styles[direction]);
    return (
      <Button className={buttonClass}
        onMouseOver={this.addHoverClass}
        onMouseLeave={this.removeHoverClass}
        onClick={onClick}
        disabled={isDisabled}
        {...optionals}>
        {children}
      </Button>
    );
  }
}

export class LeftNavButton extends Component {
  render() {
    return (
      <NavButtonContainer direction="up" {...this.props}>
        <MdKeyboardArrowUp size={24} />
      </NavButtonContainer>
    );
  }
}

export class RightNavButton extends Component {
  render() {
    return (
      <NavButtonContainer direction="down" {...this.props}>
        <MdKeyboardArrowDown size={24} />
      </NavButtonContainer>
    );
  }
}
