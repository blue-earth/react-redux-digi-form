import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './DashboardButton.scss';

class DashboardButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    children: PropTypes.node,
    type: PropTypes.oneOf(['solid', 'outline']),
    defaultWidth: PropTypes.number
  };

  static defaultProps = {
    type: 'solid',
    onClick: () => {}
  };

  getWrapperClass() {
    const { type } = this.props;
    return classNames({
      [styles.dashboardButton]: true,
      [styles[type]]: true
    });
  }

  getOptionalParams() {
    const { isDisabled, defaultWidth } = this.props;
    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = true;
    }

    if (defaultWidth) {
      optionals['style'] = { minWidth: defaultWidth };
    }
    return optionals;
  }

  render() {
    const { children, onClick } = this.props;

    return (
      <Button onClick={onClick}
        className={this.getWrapperClass()}
        {...this.getOptionalParams()}
      >
        {children}
      </Button>
    );
  }
}

export default DashboardButton;
