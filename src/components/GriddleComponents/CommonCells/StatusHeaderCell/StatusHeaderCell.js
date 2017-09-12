import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import { FaCaretDown } from 'react-icons/lib/fa';
import styles from './StatusHeaderCell.scss';
import classNames from 'classnames';
import _ from 'lodash';

class StatusHeaderCell extends Component {

  static propTypes = {
    statusList: PropTypes.array,
    selectedStatusFilterOptions: PropTypes.string,
    filterFormsByStatus: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      selectedStatusArray: this.props.selectedStatusFilterOptions.split(',')
    };
  }

  onMouseOver = () => {
    this.setState({ hover: true });
  }
  onMouseOut = () => {
    if (!this.state.isMenuOpen) {
      this.setState({ hover: false });
    }
  }

  handleMenuOpen = () => {
    this.setState({ isMenuOpen: true });
  }
  handleMenuClose = () => {
    this.setState({selectedStatusArray: this.props.selectedStatusFilterOptions.split(',')});
    this.setState({
      isMenuOpen: false,
      hover: false
    });
  }

  handleCheckboxChange = (value) => {
    const { selectedStatusArray } = this.state;
    var checked = selectedStatusArray.indexOf(value) > -1;
    if (checked) {
      _.pull(selectedStatusArray, value);
    } else {
      selectedStatusArray.push(value);
    }
    this.setState({selectedStatusArray: selectedStatusArray});
  }

  handleOK = () => {
    var newStatus = this.state.selectedStatusArray.join();
    this.props.filterFormsByStatus(newStatus);
    this.refs.dropdownTrigger.hide();
  }
  handleCancel = () => {
    this.setState({selectedStatusArray: this.props.selectedStatusFilterOptions.split(',')});
    this.refs.dropdownTrigger.hide();
  }

  render() {
    const { statusList } = this.props;
    const { selectedStatusArray } = this.state;
    const that = this;
    const dropdown = (
      <Popover className="dropdownMenuContent" id="statusDropdownMenu" placement="bottom">
        <ul className={styles.dropdownMenu}>
          {statusList.map((status, index) =>
            <li key={index} className={styles.dropdownMenuItem}>
              <label>
                <input type="checkbox"
                  checked={selectedStatusArray.indexOf(status.value) > -1}
                  onChange={function () { that.handleCheckboxChange(status.value); }} />
                {status.label}
              </label>
            </li>)
          }
        </ul>
        <div className={styles.setStatusButtons}>
          <AppButton onClick={this.handleOK}>OK</AppButton>
          {' '}
          <AppButton onClick={this.handleCancel} type="secondary">Cancel</AppButton>
        </div>
      </Popover>
    );
    return (
      <div className={styles.statusCell}>
        <OverlayTrigger
          rootClose
          ref="dropdownTrigger"
          trigger="click"
          placement="bottom"
          overlay={dropdown}
          onEnter={this.handleMenuOpen}
          onExit={this.handleMenuClose}>
          <div className={classNames(styles.titleWrapper, {[styles.hover]: this.state.hover})}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}>
            Status
            <FaCaretDown ref="dropdownIcon" size={14} className={styles.dropdownCaret} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

export default StatusHeaderCell;
