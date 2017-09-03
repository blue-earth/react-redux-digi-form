import React, {
  Component,
  PropTypes
} from 'react';
import styles from './ActionButton.scss';
import {
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';

export default class ActionButton extends Component {

  static propTypes = {
    id: PropTypes.number,
    index: PropTypes.number,
    action: PropTypes.object
  }

  handleClick = () => {
    const { action, id } = this.props;
    action.onClick(id);
    this.refs.actionTrigger.hide();
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
        <div className={styles.actionIconWrapper} onClick={this.handleClick}>
          {action.icon}
        </div>
      </OverlayTrigger>
    );
  }
}
