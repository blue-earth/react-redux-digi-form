import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import {
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/lib/md';
import classNames from 'classnames';
import styles from './ArrowButton.scss';

class ArrowButtonContainer extends Component {
  static propTypes = {
    direction: PropTypes.oneOf(['left', 'right']),
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

  addHoverClass = () => {
    this.setState({ hover: true });
  }

  removeHoverClass = () => {
    this.setState({ hover: false });
  }

  render() {
    const { hover } = this.state;
    const { primaryColor } = this.context;
    const { direction, children, onClick } = this.props;
    let optionals = {};
    hover && (optionals['style'] = { color: primaryColor });
    const buttonClass = classNames(styles.arrowButton, styles[direction]);
    return (
      <Button className={buttonClass}
        onMouseEnter={this.addHoverClass}
        onMouseLeave={this.removeHoverClass}
        onClick={onClick}
        {...optionals}>
        {children}
      </Button>
    );
  }
}

export class LeftArrowButton extends React.Component {
  render() {
    return (
      <ArrowButtonContainer direction="left" {...this.props}>
        <MdChevronLeft size={24} />
      </ArrowButtonContainer>
    );
  }
}

export class RightArrowButton extends React.Component {
  render() {
    return (
      <ArrowButtonContainer direction="right" {...this.props}>
        <MdChevronRight size={24} />
      </ArrowButtonContainer>
    );
  }
}
