import React, {
  Component,
  PropTypes
} from 'react';
import styles from './ActionButton.scss';
import {
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default class ActionButton extends Component {

  static propTypes = {
    id: PropTypes.number,
    index: PropTypes.number,
    action: PropTypes.object,
    formStatus: PropTypes.string.isRequired
  }

  get isDisabled() {
    const { formStatus, action } = this.props;
    if (formStatus === 'Draft' && (action.name === 'send' || action.name === 'view')) {
      return true;
    }
    if (formStatus === 'Live' && action.name === 'edit') {
      return true;
    }
    return false;
  }

  handleClick = () => {
    const { action, id } = this.props;
    if (!this.isDisabled) {
      action.onClick(id);
      this.refs.actionTrigger.hide();
    }
  }
  render() {
    const { action, index } = this.props;
    const tooltip = (
      <Tooltip className="actionTooltip" id={`actionTooltip-${index}-${action.name}`} placement="bottom">
        {action.label}
      </Tooltip>
    );
    return (
      <OverlayTrigger
        ref="actionTrigger"
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={tooltip}>
        <div className={cx('actionIconWrapper', {'disabled': this.isDisabled})} onClick={this.handleClick}>
          {action.icon}
        </div>
      </OverlayTrigger>
    );
  }
}
